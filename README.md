# job-application-express
###### Description
This is a program with two scripts for Job Application Automation on Indeed.

The first script- _npm run apply_ opens Indeed, and runs a cover letter application tool on the job search page for the desired job. It then expedites the repetitive qualification/gating survey that comes afterwards- inserting either a pdf (preferred) or written cover letter on the cover letter entry page based on the original cover letter inputs. It also saves the specific job application data to a postgresql database to be used for the following script...

The second script _npm run dump_ makes a call to the postgresql database and returns all completed job application data objects. In then opens Huntr.co and asynchronously loops through that list of objects, inserting them into the Huntr.co UI.

## Global Dependencies (nvm)
###### in... /Users/_username_/.nvm/versions/node/v10.18.0/lib/node_modules - (on my machine)

###### ----------------------------
 - node v10.18.0 (necessary for robotjs/node-gyp)
 - jsonresume-theme-actual-letter
 - resume-cli
 - node-gyp
 - webdriver-manager

###### For example...
* nvm install 10.18.0
* nvm use 10.18.0
* npm install -g jsonresume-theme-actual-letter resume-cli node-gyp webdriver-manager

#### .env structure (placed in root of project)->

- CHROMEPROFILE=_LocalPathToSeleniumChromeProfile_
- FIRSTNAME='_FirstName_'
- LASTNAME='_LastName_'
- FULLNAME='_FirstName LastName_'
- PHONENUMBER='_PhoneNumber_'
- EMAIL='_UserEmail_'

- LOCATION='_City, State(shorthand)_'
- CITY='_City_'
- REGION='_State Written Out_'
- COUNTRYCODE='_Country(shorthand)_'
- RECENTJOBTITLE='_Job Title for Relevant Work Experience_'
- RECENTJOBWORK='_Job Work for Relevant Work Experience_'

- WEBSITE='_User-Website-URL_'
- LINKEDIN='_User-Linkedin-URL_'
- GITHUB='_User-Github-URL_'

- PGDATABASE='jobapplicationdump'
- PGUSER='_pgusername_'
- PGPASSWORD=_null-or-pgpassword_

- HUNTREMAIL='_Huntr-Email_'
- HUNTRPASSWORD='_Huntr-Password_'




