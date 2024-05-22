My Buddy Flutter App

Dependencies:
Flutter > version 3.0
Android Studio / ios Xcode


Instructions to run

Make sure you configure appauth android setup correctly by following the instructions at https://github.com/MaikuB/flutter_appauth/tree/master/flutter_appauth#android-setup

Create .env file in tfrom .env.example
Open ios Simulator / Android Emulator
flutter run

Building the models:
Models are generated using swagger code gen.
Build tasks are available in build.yaml then run the following command
dart run build_runner build --delete-conflicting-outputs



Generate Icon:

flutter pub run flutter_launcher_icons:main

Launching Android Emulator:

flutter emulators --launch flutter_emulator

