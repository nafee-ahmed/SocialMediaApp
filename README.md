## How to run:

* Install docker

* Make a new file named `config.env` on the directory `{project root directory}/server`, and set it up following example.config.env. You need to setup mongoDB, JWT, and cloudinary

* Go to the root project directory and run `docker-compose up`

* Go to url `http://localhost:3000/login`. Done!! Super simple since it's already dockerized.

## Attractive Features...

### Authentication System

The application hosts a secure system, where the passwords are encrypted. The sign-up page looks like this. Sign up to start using the application. After successful sign-up, user is redirected to the home page. 

<img src="./Images/1.png" title="" alt="" width="721">

Alternatively, you can use the authentication details you signed up with, to login to the system. 

<img src="./Images/2.png" title="" alt="" width="714">

Forgot Password? Fret not, you can always use the forgot password feature to retrieve your account. It will send an email to the email of the registered account, and guide you to reset your password.

<img src="./Images/3.png" title="" alt="" width="703"> 

Logout option is also available on the side bar

### Side Navbar

The navbar is expanded when hovered, and collapses when unhovered. 

<img src="./Images/5.png" title="" alt="" width="752">

### Home Page

You can use search bar, available throughout the application, to search for your friends, and send a friend request. The posts of the friends appear on the home page. Users with matching interests, also show up, to expand your network. 

<img src="./Images/4.png" title="" alt="" width="755">

You can also like, comment on your friends' posts, and it shows the count of them as shown below:

<img src="./Images/6.png" title="" alt="" width="763">

### Adding posts

Click on the "Add" icon, on the top navbar, to add posts, and you can also add an image if you want, which is securely stored on the cloud, cloudinary

<img src="./Images/7.png" title="" alt="" width="758">

### Profile Page

The profile page shows the list of your posts, and shows the count of likes and comments of each post. Clicking on the like, comment icons shows the details. 

<img src="./Images/8.png" title="" alt="" width="749">

### Notifications and Friend Requests are sent on real-time

You don't have to refresh the page, in order to get the updated list of notifications and friend requests, as it is sent real-time through socket-io, realizing how important the notifications are, sent from friends and family. The options for notifications and friend requests are available on the side navbar

<img src="./Images/9.png" title="" alt="" width="745">

### Settings Page

The settings option is available on the side bar, which can help you alter various settings that you inputted, while you signed up. You can also upload your profile picture, which is also stored securely on the cloud, cloudinary, likewise. The option to delete your account is also available here. 

<img src="./Images/10.png" title="" alt="" width="777">



### Sending friend requests

Once you found the user to add, either by searching on the search bar or through the friend suggestion box, you can send the friend request. The button for sending friend request shows the status, and gets enabled/disabled accordingly. 

<img src="./Images/11.png" title="" alt="" width="771">


