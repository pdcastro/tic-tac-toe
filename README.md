<!-- omit in toc -->
# ReactJS exercise:  Tic-Tac-Toe game

- [About](#about)
- [Framework](#framework)
- [Test cases](#test-cases)
- [Deployment with AWS Amplify](#deployment-with-aws-amplify)
  - [`amplify init` command](#amplify-init-command)
  - [`amplify add hosting` command](#amplify-add-hosting-command)
  - [`amplify publish` command](#amplify-publish-command)

## About

To get my feet wet with ReactJS, I went through the excellent [concept
guide](https://reactjs.org/docs/hello-world.html) and
[tutorial](https://reactjs.org/tutorial/tutorial.html) on the
[ReactJS.org](https://reactjs.org) website and the comprehensive documentation on the
[Create-React-App.dev](https://create-react-app.dev) website. I converted the ReactJS
tutorial's tic-tac-toe game to TypeScript, added test cases (100% coverage) using the
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/),
and deployed the game to the cloud using the [AWS
Amplify](https://aws.amazon.com/amplify/) service (which builds on AWS CloudFormation,
S3 and CloudFront) as detailed below.

My deployment of the tic-tac-toe game can be found at https://d3n693iqtmddk5.cloudfront.net
and the source code is in this GitHub repository.

## Framework

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
and the standard scripts are available:

* `npm start` to run a development server at [http://localhost:3000](http://localhost:3000).
* `npm test` to launch the test runner (more details below).
* `npm run build` to build the app for production in the `build` folder.

## Test cases

The test cases are in the [src/App.test.tsx](src/App.test.tsx) file (TypeScript + JSX).
They use [Jest](https://jestjs.io) and the [React Testing
Library](https://testing-library.com/docs/react-testing-library/intro/) and were written
to simulate an end user's interaction with the browser DOM elements, following the
principle that _"[The more your tests resemble the way your software is used, the more
confidence they can give you.](https://testing-library.com/docs/guiding-principles)"_
As such, they are not necessarily unit tests that focus on isolated functions or classes.
The tests nonetheless achieve 100% line and branch coverage as shown in the output of
the `npm test` command:

```
$ npm test

> react-scripts test --coverage

 PASS  src/App.test.tsx
  ✓ Renders the game initial status (62 ms)
  ✓ Renders "X" and "O" when squares are clicked in turn (39 ms)
  ✓ Renders the winner and prevents further square clicks (66 ms)
  ✓ Renders history buttons (38 ms)
  ✓ Renders previous game states when history buttons are clicked (56 ms)
  ✓ Removes some history buttons when the history changes (59 ms)
  ✓ Calculates the winner (calculateWinner() algorithm) (2 ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 App.tsx  |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.282 s
Ran all test suites related to changed files.
```

## Deployment with AWS Amplify

The AWS Amplify CLI (Command Line Interface) was used for the purpose of reproducibility
(potential automation / scripting). The output of three key commands is given below.

### `amplify init` command

The project was initialized with the `amplify init` command that creates local configuration
files and cloud resources such as AWS IAM roles, S3 buckets and a CloudFormation stack:

```
$ cd tic-tac-toe
$ amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project tictactoe
The following configuration will be applied:

Project information
? Enter a name for the environment prod
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

? Please choose the profile you want to use default
Adding backend environment prod to AWS Amplify app: dbth78vqsy1jb

Deployment completed.
Deployed root stack tictactoe [ ======================================== ] 4/4
	amplify-tictactoe-prod-211040  AWS::CloudFormation::Stack     CREATE_COMPLETE
	AuthRole                       AWS::IAM::Role                 CREATE_COMPLETE
	UnauthRole                     AWS::IAM::Role                 CREATE_COMPLETE
	DeploymentBucket               AWS::S3::Bucket                CREATE_COMPLETE

✔ Help improve Amplify CLI by sharing non sensitive configurations on failures (y/N) · no
Deployment bucket fetched.
✔ Initialized provider successfully.
✔ Initialized your environment successfully.

Your project has been successfully initialized and connected to the cloud!

Some next steps:
"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

Pro tip:
Try "amplify add api" to create a backend API and then "amplify push" to deploy everything
```

### `amplify add hosting` command

The AWS [S3](https://aws.amazon.com/s3/) and [CloudFront](https://aws.amazon.com/cloudfront/)
(CDN) services were chosen to host the web app:

```
$ amplify add hosting
✔ Select the plugin module to execute · Amazon CloudFront and S3
? Select the environment setup: PROD (S3 with CloudFront using HTTPS)
? hosting bucket name pdcastro-tictactoe-hostingbucket
Static webhosting is disabled for the hosting bucket when CloudFront Distribution is enabled.

You can now publish your app using the following command:
Command: amplify publish
```

### `amplify publish` command

The web app was deployed to https://d3n693iqtmddk5.cloudfront.net with the `amplify publish`
command:

```
$ amplify publish
✔ Successfully pulled backend environment prod from the cloud.

    Current Environment: prod

┌──────────┬─────────────────┬───────────┬───────────────────┐
│ Category │ Resource name   │ Operation │ Provider plugin   │
├──────────┼─────────────────┼───────────┼───────────────────┤
│ Hosting  │ S3AndCloudFront │ Create    │ awscloudformation │
└──────────┴─────────────────┴───────────┴───────────────────┘
? Are you sure you want to continue? Yes

Deployment completed.
Deployed root stack tictactoe [ ======================================== ] 2/2
	amplify-tictactoe-prod-211040  AWS::CloudFormation::Stack     UPDATE_COMPLETE
	hostingS3AndCloudFront         AWS::CloudFormation::Stack     CREATE_COMPLETE
Deployed hosting S3AndCloudFront [ ======================================== ] 4/4
	S3Bucket                       AWS::S3::Bucket                CREATE_COMPLETE
	OriginAccessIdentity           AWS::CloudFront::CloudFrontOr… CREATE_COMPLETE
	CloudFrontDistribution         AWS::CloudFront::Distribution  CREATE_COMPLETE
	PrivateBucketPolicy            AWS::S3::BucketPolicy          CREATE_COMPLETE


Hosting endpoint: https://d3n693iqtmddk5.cloudfront.net


> tic-tac-toe@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  47.92 kB  build/static/js/main.cd0d3ed1.js
  2.53 kB   build/static/js/496.2ad7bf28.chunk.js
  362 B     build/static/css/main.22941023.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

frontend build command exited with code 0
Publish started for S3AndCloudFront
✔ Uploaded files successfully.
Your app is published successfully.
https://d3n693iqtmddk5.cloudfront.net
```
