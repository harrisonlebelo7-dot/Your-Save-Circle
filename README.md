# Your-Save-Circle
Safety App
## Introduction
Your-Safe-Circle is a personal safety app concept designed to help people reach trusted contacts, share their location, find nearby emergency services and remember to check in during a journey. The app is intended for students, commuters and community members who may feel unsafe while travelling or spending time alone.

## Problem statement
In an urgent or uncomfortable situation, a person may need to complete several separate actions: find a trusted contact, explain where they are, open a map and locate an emergency number. Stress, low battery, weak connectivity or limited digital confidence can make this process more difficult. A single, clear safety screen could reduce the effort needed to begin asking for help.

## Proposed solution
The app groups four actions on one home screen: Emergency SOS, Share My Location, Nearby Emergency Services and Safe Check-in. The emergency action prepares a message that includes a location link when permission is available and offers phone links to trusted contacts and emergency numbers. The location feature supports everyday travel. The services feature opens map searches. The check-in timer encourages users to confirm they arrived safely.

## Target users
Primary users include college and university students, people commuting to work, people travelling alone and community members who want a simple way to contact people they trust. Possible partners include campus safety offices, student support teams, community organisations and local safety initiatives.

## Community and institutional value
The app may support better safety planning by making trusted contacts and emergency resources easier to access. Educational institutions could share safety guidance or promote the app as one part of a wider campus safety plan. Community groups could use user feedback to identify which safety information is missing. The app must not replace emergency services, institutional safeguarding processes or a person's own judgement.

## Technology
The prototype uses HTML for structure, CSS for a responsive mobile-first interface and JavaScript for interaction. Browser geolocation is used only after the user grants permission. Contact details are stored in local browser storage for the demo. A web manifest and service worker provide a basic app-like install experience and cache the app shell.

## Privacy and safety
Location is sensitive information. The user should understand what is shared, with whom and for how long. A production release would require a privacy policy, appropriate security controls, a POPIA review, a clear data retention policy and protection against abusive monitoring. The prototype does not silently send messages, track continuously in the background or contact emergency dispatch services.

## Evaluation
The first test will involve 5–8 volunteers using test contacts. We will observe task completion, time taken, confusing labels and privacy concerns. We will aim for at least 80% of participants to find the main actions without assistance and ensure nobody mistakenly believes emergency services have been contacted.

## Conclusion
Your-Safe-Circle offers a simple, testable starting point for personal safety technology. Its value will depend on user feedback, transparent limits, careful privacy design and reliable integrations before any public launch.
