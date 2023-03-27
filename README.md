# Major

This ia an application when is used to store data from an NodeMCU through an http request


# Required Software
* Node Version 18.x.x
* Spring boot 2.7.5
* Maven
* MySQL version 8.0.0

# Step 1
# To install node 
For mac or linux based systems type the below command in terminal
` brew install node `
For windows follow the steps below 
* Go to the official Node.js website: https://nodejs.org/
* Click on the "Download" button on the homepage.
* Select the Windows installer option.
* Choose the appropriate version based on your operating system (32-bit or 64-bit).
* Run the installer and follow the installation instructions.
* Once the installation is complete, open a command prompt or terminal window and type "node -v" to verify that Node.js is installed correctly.

# Step 2
# Cloning the project
Clone the project from repository using `git clone`

# Step 3
# Setup client side
After clone the app move the folder /Major/client
Use the command below command 
`npm i -f'

# Step 4 
# Setup MySQl server
* Go to the MySQL website: https://www.mysql.com/downloads/
* Click on the "MySQL Community Server" download button.
* Run the installer and follow the on-screen instructions to complete the installation process.
* During the installation process, you will be prompted to set a root password for the MySQL server. Make sure to remember this password, as you will need it to access the server later.
* Once the installation is complete, you can start the MySQL server by opening the "MySQL Command Line Client" application, which should be installed as part of the MySQL server installation.
* Enter the root password when prompted to log in to the MySQL server.
* CREATE DATABASE MACHINE;

# Step 4
# Setup maven or go with Intellij
* In intellij open /Major/api
* Then locate pom.xml
* Right click then sink the pom.xml

# Step 5 
# Starting the App
* Open a terminal navigate to /Major/client
* Then type npm run webpack:dev
* Now navigate to intellej Open /Major/api
* Build the project with openjdk-18
* Run the server by clciking the play button or use `mvn spring-boot:run' this works only when maven is installed

# App will run at port 80 so the url will be http://localhost

