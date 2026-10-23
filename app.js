const $ = (id) => document.getElementById(id);
const dialogs = ["contactsDialog","sosDialog","checkinDialog","servicesDialog"];
const openDialog = (id) => $(id).showModal();
const closeDialog = (id) => $(id).close();
let toastTimer;
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3200);}
function getContacts(){try{return JSON.parse(localStorage.getItem("ysc_contacts")||"[]")}catch{return []}}
function saveContacts(contacts){localStorage.setItem("ysc_contacts",JSON.stringify(contacts));updateSetupStatus();}
function updateSetupStatus(){const contacts=getContacts().filter(c=>c.name&&c.phone);$("setupStatus").textContent=contacts.length?`${contacts.length} trusted contact${contacts.length===1?"":"s"} saved`:"Set up your trusted circle to get started";}
function renderContactFields(){
  const contacts=getContacts(); const wrap=$("contactFields");wrap.innerHTML="";
  for(let i=0;i<3;i++){const c=contacts[i]||{name:"",phone:""};const div=document.createElement("div");div.className="contact-entry";
    div.innerHTML=`<h3>Trusted person ${i+1}</h3><label class="field-label" for="contactName${i}">Name</label><input class="field" id="contactName${i}" maxlength="60" placeholder="e.g. Alex" value="${escapeAttr(c.name)}"><label class="field-label" for="contactPhone${i}">Mobile number (include country code)</label><input class="field" id="contactPhone${i}" type="tel" maxlength="25" placeholder="e.g. +27 82 123 4567" value="${escapeAttr(c.phone)}"></div>`;
    wrap.appendChild(div);
  }
}
function escapeAttr(s){return String(s||"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;")}
$("settingsOpen").addEventListener("click",()=>{renderContactFields();openDialog("contactsDialog")});
$("contactsOpen").addEventListener("click",()=>{renderContactFields();openDialog("contactsDialog")});
$("saveContacts").addEventListener("click",()=>{
  const contacts=[];for(let i=0;i<3;i++){const name=$(`contactName${i}`).value.trim(),phone=$(`contactPhone${i}`).value.trim();if(name||phone){if(!name||!phone){$("contactMessage").textContent=`Please add both a name and number for person ${i+1}, or leave both fields empty.`;return;}contacts.push({name,phone});}}
  saveContacts(contacts);$("contactMessage").textContent="Trusted circle saved on this device.";toast("Trusted contacts saved.");
});
$("sosButton").addEventListener("click",()=>{ $("sosStatus").textContent="Ready when you are."; $("sosProgress").style.width="0%";$("sosResult").classList.add("hidden");$("prepareAlert").disabled=false;$("prepareAlert").textContent="Get location & prepare alert";openDialog("sosDialog");});
$("cancelSos").addEventListener("click",()=>closeDialog("sosDialog"));
function getPosition(){return new Promise((resolve,reject)=>{if(!navigator.geolocation){reject(new Error("This browser does not support location."));return;}navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:12000,maximumAge:0});});}
function mapLink(kind,lat,lon){const q=encodeURIComponent(`${kind} near me`);return lat!=null?`https://www.google.com/maps/search/${q}/@${lat},${lon},13z`:`https://www.google.com/maps/search/${q}`;}
$("prepareAlert").addEventListener("click",async()=>{
  const contacts=getContacts().filter(c=>c.name&&c.phone);
  $("prepareAlert").disabled=true;$("prepareAlert").textContent="Preparing…";$("sosProgress").style.width="30%";$("sosStatus").textContent="Trying to get your current location…";
  let lat=null,lon=null,locationText="Location unavailable — please share it manually if safe.";
  try{const pos=await getPosition();lat=pos.coords.latitude;lon=pos.coords.longitude;locationText=`My current location: https://maps.google.com/?q=${lat},${lon}`;$("sosProgress").style.width="70%";}
  catch(err){locationText="I may need help. My location could not be accessed. Please contact me and help me get support.";$("sosStatus").textContent="Location unavailable. You can still prepare an alert or call 112.";}
  const message=`EMERGENCY — I may need help. Please try to contact me now. ${locationText}`;
  const result=$("sosResult");result.classList.remove("hidden");
  const safeMessage=escapeAttr(message);
  let html=`<strong>Alert message prepared</strong><p>${safeMessage}</p>`;
  if(contacts.length){html+=`<p><strong>Choose a contact to message:</strong></p>`;contacts.forEach((c,i)=>{const href=`sms:${encodeURIComponent(c.phone)}?body=${encodeURIComponent(message)}`;html+=`<p><a href="${href}">Open message for ${escapeAttr(c.name)}</a></p>`;});}
  else{html+=`<p>No trusted contacts are saved yet. Add contacts in Settings, or call emergency services.</p>`;}
  if(lat!=null){html+=`<p><a target="_blank" rel="noopener" href="${mapLink("emergency services",lat,lon)}">Open nearby services on map</a></p>`;}
  html+=`<p><a href="tel:112">Call 112 now</a> · <a href="tel:10111">Police 10111</a></p>`;
  result.innerHTML=html;$("sosProgress").style.width="100%";$("sosStatus").textContent=contacts.length?"Alert prepared. Tap a contact link to open your messaging app.":"Alert prepared, but no contacts are saved.";
  $("prepareAlert").textContent="Prepare again";
  // Allow user to run again, rather than pretending messages were sent.
  $("prepareAlert").disabled=false;
});
$("shareLocation").addEventListener("click",async()=>{
  const contacts=getContacts().filter(c=>c.name&&c.phone);
  try{const p=await getPosition();const url=`https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`;const message=`Here is my current location: ${url}`;
    if(navigator.share){await navigator.share({title:"My location",text:message,url});}
    else{const result=await navigator.clipboard?.writeText(message);if(result===undefined){window.open(url,"_blank","noopener");toast("Location map opened. Copy its link to share.");}else toast("Location link copied. Share it with your trusted circle.");}
  }catch(e){if(e.name!=="AbortError")toast("Location was not shared. Check location permission and try again.");}
});
$("nearbyServices").addEventListener("click",()=>openDialog("servicesDialog"));
async function openMap(kind){try{const p=await getPosition();window.open(mapLink(kind,p.coords.latitude,p.coords.longitude),"_blank","noopener");}catch{window.open(mapLink(kind,null,null),"_blank","noopener");toast("Opened a map search. Allow location for a more precise result.");}}
$("mapPolice").addEventListener("click",()=>openMap("police stations"));
$("mapHospitals").addEventListener("click",()=>openMap("hospitals"));
$("mapClinics").addEventListener("click",()=>openMap("clinics"));
$("checkinOpen").addEventListener("click",()=>openDialog("checkinDialog"));
let timerInterval=null,timerEnd=null;
function updateTimer(){const remaining=Math.max(0,Math.ceil((timerEnd-Date.now())/1000));$("timerState").textContent=remaining?`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")} remaining`:"Check-in time reached";if(remaining===0){clearInterval(timerInterval);timerInterval=null;$("iAmSafe").classList.remove("hidden");toast("Your check-in time has arrived. Please confirm you are safe.");}}
$("startTimer").addEventListener("click",()=>{if(timerInterval)clearInterval(timerInterval);timerEnd=Date.now()+Number($("timerMinutes").value)*60000;$("iAmSafe").classList.remove("hidden");$("cancelTimer").classList.remove("hidden");$("startTimer").textContent="Restart timer";updateTimer();timerInterval=setInterval(updateTimer,1000);toast("Safety check-in timer started.");});
$("iAmSafe").addEventListener("click",()=>{if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerEnd=null;$("timerState").textContent="You're checked in. Stay safe!";$("iAmSafe").classList.add("hidden");$("cancelTimer").classList.add("hidden");$("startTimer").textContent="Start check-in timer";toast("Check-in completed.");});
$("cancelTimer").addEventListener("click",()=>{if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerEnd=null;$("timerState").textContent="No active check-in";$("iAmSafe").classList.add("hidden");$("cancelTimer").classList.add("hidden");$("startTimer").textContent="Start check-in timer";});
dialogs.forEach(id=>$(id).addEventListener("click",e=>{if(e.target===$(id))$(id).close()}));
updateSetupStatus();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("service-worker.js").catch(()=>{});
