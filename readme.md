# StudyBook
***
## A platform to share documents between students or professors

StudyBook is a college project created by Aintzel Bereziartua, Unai Galicia and Iker Hernandez. The aim of the project is to create an open platform that enables the sharing of University related files to students and proffesors.

Thanks to StudyBook, students can store information either privately or publicly, they can share their documents with class partners, professors or with the whole university, and can likewise search and get documents from other students or professors. StudyBook also allows professors or researchers to share their work among colleagues or students.

### Functionalities

StudyBook offers an easy-to-use interface, and provides these functionalities to users:

1. Creation of profiles for all users
2. Creation of public and private areas, named communities
    * Private area: Each account has one, lets the user manage its own profile: Upload a file, check uploaded files. Files here can either be public or private.
    * Public areas / communities: Spaces organized by different themes so that users can upload their contents publicly. All files are public.
    
3. Each uploaded file has a section for comments, and a count of likes/dislikes.

### Technologies used

- In order to use a document-based DB, MongoDB was chosen. Precisely, a MongoDB Atlas instance was used. This instance is currently shut down. The Mongoose middleware was also used to manage the DB.
- The files were uploaded directly into the DB instead of using a file system. This option was in part chosen as the academic documents were not expected to exceed 5 MB. Costs and time were also big factors. However, this was intended to be replaced with the use of Amazon S3, for example.
- In order to store files directly into the MongoDB instance, the [_GridFS_](https://www.mongodb.com/docs/manual/core/gridfs/) and [_Multer_](https://www.npmjs.com/package/multer) middlewares were used.
- The application was mainly written in JavaScript, and deployed using Node.JS and the Express framework.
- The Flash, Passport, Crypto, Express-Session and Cookie-Parser middlewares were also used to manage web messages, sessions and password-related aspects.
- The front-end was developed with EJS and CSS. The Bulma framework was also used.
- An Amazon EC2 instance was used to deploy the app. This instance is currently shut down.

***
### Notes
- The GUI is completely written in Basque.
- The app can be locally tested, but the MongoDB URI must be replaced with the local DB URI.
- The app was developed using the IntelliJ IDEA IDE.