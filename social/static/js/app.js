
const width = window.innerWidth;

function handlechange(event){
    var handle = event.target.value.split(" ").join("");
    var handle = handle.split("/").join("");
    var handle = handle.split("?").join("");
    var handle = handle.split("&").join("");
    var handle = handle.split("=").join("");
    var handle = handle.split("#").join("");
    var handle = handle.split("%").join("");
    var handle = handle.split("$").join("");
    var handle = handle.split("^").join("");
    var handle = handle.split("*").join("");
    var handle = handle.split("(").join("");
    var handle = handle.split(")").join("");
    var handle = handle.split("[").join("");
    var handle = handle.split("]").join("");
    var handle = handle.split("{").join("");
    var handle = handle.split("}").join("");
    var handle = handle.split("|").join("");
    var handle = handle.split("<").join("");
    var handle = handle.split(">").join("");
    var handle = handle.split("+").join("");
    var handle = handle.toLowerCase();

    document.getElementById('handleshown').innerHTML = "@"+handle;
    document.getElementById('handle').value = handle;

    fetch('/checkhandle/'+handle)
    .then(response =>{
       response.json().then(response => {
            const isTaken = response.is_taken;
            if(isTaken){
                let x = Math.floor((Math.random() * 9) + 1);
                let y = Math.floor((Math.random() * 9) + 1);
                let z = Math.floor((Math.random() * 9) + 1);
                str= x.toString()+ y.toString()+z.toString()
                handle = handle + str;
                document.getElementById('handleshown').innerHTML = "@"+handle;
                document.getElementById('handle').value = handle;
            }
          })
    } )
}

window.onload =function(){
   stories= document.getElementsByClassName('story')
   for (let story of stories) {
    let url = story.getAttribute("data-url");
    story.style.backgroundImage = "url('" + url + "')";
    story.style.backgroundRepeat = "no-repeat";
    story.style.backgroundPosition = "center center";
    story.style.backgroundSize = "cover";
}
}












// ........External Code........
// ........External Code........
// ........External Code........
// ........External Code........
// ........External Code........
// ........External Code........



// Sidebar
// const menuItems = document.querySelectorAll('.menu-item');
const menuItems = document.querySelectorAll('.menu-item');

// Messages 
const messageNotification = document.querySelector('#messages-notifications');
const messages = document.querySelector('.messages');
 var message
if(messages) {

     message = messages.querySelectorAll('.message');
}
const messageSearch = document.querySelector('#message-search');

// ============== SIDEBAR ============== 

// Remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications') {
            document.querySelector('.notifications-popup').
            style.display = 'none';
        } else {
            if(width>992) {
            document.querySelector('.notifications-popup').
            style.display = 'block';
            document.querySelector('#notifications .notification-count').
            style.display = 'none';
            }
        }
    })
})

// ============== MESSAGES ============== 

//Searches messages
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1) {
            user.style.display = 'flex'; 
        } else {
            user.style.display = 'none';
        }
    })
}

//Search for messages
if(messageSearch){

    messageSearch.addEventListener('keyup', searchMessage);
}

//Highlight messages card when messages menu item is clicked
if(messageNotification){
messageNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messageNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    }, 2000);
})

}

// JavaScript for search icon
document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const modalSearch = document.getElementById('modal-search');
    const closeBtn = document.getElementsByClassName('close')[0];
    const searchbtn= document.getElementsByClassName('search-btn');

    searchIcon.addEventListener('click', function() {
        modalSearch.style.display = 'block';
    });
    searchbtn[0].addEventListener('click', function() {
        console.log('clicked');
    });
    closeBtn.addEventListener('click', function() {
        modalSearch.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalSearch) {
            modalSearch.style.display = 'none';
        }
    });
});


// Get the profile picture and profile modal elements
const profilePicture = document.getElementById('profile-picture');
const profileModal = document.getElementById('profile-modal');

// Add click event listener to profile picture
profilePicture.addEventListener('click', () => {
    // Open the profile modal
    console.log('clicked');
    profileModal.style.display = 'block';
});

// Get the close button for the profile modal
const profileModalClose = profileModal.querySelector('.close');

// Add click event listener to profile modal close button
profileModalClose.addEventListener('click', () => {
    // Close the profile modal
    profileModal.style.display = 'none';
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
});





//create post section of homepage
var postInput = document.getElementById('create-post');

// Get the modal
var modal = document.getElementById('postModal');

// When the post input is clicked, show the modal
if(postInput)   {
postInput.addEventListener('click', function () {
    modal.style.display = 'block';
});
}

// When the user clicks on the close button, hide the modal
var closeButton = document.getElementById('post-modal-close');
if(closeButton){
closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
});
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});



// Handle image Input for post
// Handle image Input for post
// Handle image Input for post

function handleImageInput(event){
    var imagediv = document.getElementById('img-preview-div');
    var imagePreview = document.getElementById('post-image-preview');
    document.getElementById('post-upload-text').removeAttribute('required')
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(){
        imagePreview.src = reader.result;
        imagediv.style.display = 'flex';
    }
    reader.readAsDataURL(file);
}


function openimageinput(){
    document.getElementById('img-input').click();
}
function openprofileimageselector(){
    document.getElementById('profile-img-input').click();

}
function openprofileimageselector2(){
    document.getElementById('profile-img-input2').click();

}
function handleProfileImageInput(event){
    var imagePreview = document.getElementById('nav-pro-pic');
    document.getElementById('propic-update-action-btns').style.display = 'flex';
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(){
        imagePreview.src = reader.result;
    }
    reader.readAsDataURL(file);
}
function handleProfileImageInput2(event){
    var imagePreview = document.getElementById('nav-pro-pic2');

    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(){
        imagePreview.src = reader.result;
    }
    reader.readAsDataURL(file);
}
function removeSelectedImage(){
    var imagediv = document.getElementById('img-preview-div');
    document.getElementById('post-upload-text').setAttribute('required')

    var imagePreview = document.getElementById('post-image-preview');
    imagePreview.src = "";
    imagediv.style.display = 'none';
}

function reload(){
    location.reload();
}


function handlepropicupload(){
    var image = document.getElementById('nav-pro-pic').src;
    var form = new FormData();
    form.append('image', image);
    fetch('/updatepropic/',{
        method: 'POST',
        body: form
    })
    .then(response => {
        response.json().then(response => {
          console.log(response);  
        })
    })

}

function submitpost(){
    document.getElementById('post-submit').click();
}



//get posts


function fetchPosts() {
    fetch('/get_posts/')
        .then(response => response.json())
        .then(data => {
            console.log(data.posts.length);
            if (data.posts.length > 0) {
                // Render posts on the frontend
                renderPosts(data.posts);
            } else {
                // If no posts available, display a message
                displayNoPostsMessage();
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}



function handlelike(event){

    if(event.currentTarget.classList.contains('fa-heart')){
        event.currentTarget.classList.remove('fa-solid');
        event.currentTarget.classList.remove('fa-heart');
        event.currentTarget.classList.add('uil');
        event.currentTarget.classList.add('uil-heart');
        event.currentTarget.style.color = 'black';

        // next code will send backend request to unlike post
        post_id= event.currentTarget.getAttribute('data-postId');
        document.getElementById('likes-'+post_id).textContent = parseInt(document.getElementById('likes-'+post_id).textContent) - 1;

        fetch('/unlike_post/'+post_id)
        .then(response => {
            response.json().then(response => {
                console.log(response);
            })
        })
        // send 
    }else{
    
event.currentTarget.classList.remove('uil');
event.currentTarget.classList.remove('uil-heart');
event.currentTarget.classList.add('fa-solid');
event.currentTarget.classList.add('fa-heart');
event.currentTarget.style.color = 'red';
// next code will send backend request to like post

   post_id= event.currentTarget.getAttribute('data-postId');
    document.getElementById('likes-'+post_id).innerHTML = parseInt(document.getElementById('likes-'+post_id).innerHTML) + 1;
    fetch('/like_post/'+post_id)
    .then(response => {
        response.json().then(response => {
            console.log(response);
        })
    })
    

}


}



// function renderPosts(posts) {
//     console.log(posts);
//     posts.forEach(post => {
//         // Create the main feed container
//         const feedContainer = document.createElement('div');
//         feedContainer.classList.add('feed');

//         // Create the head section
//         const head = document.createElement('div');
//         head.classList.add('head');

//         // Create the user section within the head
//         const user = document.createElement('div');
//         user.classList.add('user');

//         // Create the profile picture within the user section
//         const profilePicture = document.createElement('div');
//         profilePicture.classList.add('profile-picture');
//         const profilePictureImg = document.createElement('img');
//         profilePictureImg.setAttribute('src', post.profilePicture); // Assuming 'profilePicture' is a field in the post object containing the image URL
//         profilePictureImg.setAttribute('alt', 'Profile Picture');
//         profilePicture.appendChild(profilePictureImg);

//         // Create the info section within the user section
//         const info = document.createElement('div');
//         info.classList.add('info');
//         const username = document.createElement('h3');
//         username.textContent = post.username; // Assuming 'username' is a field in the post object
//         const time = document.createElement('small');
//         time.textContent = post.time; // Assuming 'time' is a field in the post object
//         info.appendChild(username);
//         info.appendChild(time);

//         // Append profile picture and info to the user section
//         user.appendChild(profilePicture);
//         user.appendChild(info);

//         // Create the edit section within the head
//         const edit = document.createElement('span');
//         edit.classList.add('edit');
//         const editIcon = document.createElement('i');
//         editIcon.classList.add('uil', 'uil-ellipsis-h');
//         edit.appendChild(editIcon);

//         // Append user and edit sections to the head
//         head.appendChild(user);
//         head.appendChild(edit);

//         // Create the photo section
//         const photo = document.createElement('div');
//         photo.classList.add('photo');
//         const photoImg = document.createElement('img');
//         photoImg.setAttribute('src', post.image); // Assuming 'photo' is a field in the post object containing the image URL
//         photoImg.setAttribute('alt', 'Post');
//         photo.appendChild(photoImg);

//         // Create the action button section
//         const actionButton = document.createElement('div');
//         actionButton.classList.add('action-button');
//         // Assuming you have more elements here, you can create and append them similarly

//         // Append head, photo, and action button sections to the feed container
//         feedContainer.appendChild(head);
//         feedContainer.appendChild(photo);
//         feedContainer.appendChild(actionButton);

//         // Append the feed container to the posts container
//         document.getElementById('feeds').appendChild(feedContainer);
//     });
// }


function displayNoPostsMessage() {
    const messageElement = document.createElement('p');
    messageElement.textContent = 'No more posts to show';
    document.getElementById('posts-container').appendChild(messageElement);
}




function openemojipicker(event){
 
    const inputField = document.getElementById("comment-"+event.currentTarget.getAttribute('data-postId'));  
    function emoji(selectedEmoji) {
        inputField.value += selectedEmoji.native;
    }
    
    const pickerOptions = { onEmojiSelect:emoji,dynamicWidth: true }
    const picker = new EmojiMart.Picker(pickerOptions)
    var emojiPickerContainer = document.getElementById('emoji-picker-'+event.currentTarget.getAttribute('data-postId'));
    
    if (emojiPickerContainer.hasChildNodes()) {
        emojiPickerContainer.innerHTML = '';
    }
    emojiPickerContainer.appendChild(picker)
    emojiPickerContainer.style.display = emojiPickerContainer.style.display === 'block' ? 'none' : 'block';

}



// Function to open the emoji picker


// Button event listener to open the emoji picker






function opencomments(event){
    postId= event.currentTarget.getAttribute('data-postId')
    console.log(postId)
    target= document.getElementById('comments-'+postId)
    target.style.display= target.style.display === 'flex' ? 'none' : 'flex';
}

function sendcomment(event){
    postId= event.currentTarget.getAttribute('data-postId')
    var comment = document.getElementById('comment-'+postId).value;
    document.getElementById('comment-count-'+postId).innerHTML = parseInt(document.getElementById('comment-count-'+postId).innerHTML) + 1;
    fetch('/comment_post/'+postId,{
        method: 'POST',
        body: JSON.stringify({
            'text': comment,
            'post_id': postId
        })
    })
    .then(response => {
        response.json().then(response => {
            console.log(response);
        })
    })
}


function loadmore(event){
    var post_count= event.currentTarget.getAttribute('data-post_count');
    post_count= parseInt(post_count);
    post_count= post_count+10;
    event.currentTarget.setAttribute('data-post_count', post_count);
    fetch('/get_posts/'+post_count)
    .then(response => {
        response.text().then(response => {
            if(response.length < 10){
                document.getElementById('loadmore').style.display = 'none';
                document.getElementById('loadmore').parentNode.innerHTML += "<p style='text-align:center;'>No more posts to show</p>";
            }
            document.getElementById('feeds').innerHTML +=response;
        })
    })

}


function getlocationsuggestion(event){
    // var location = event.target.value;
    var location = event.target.value.replace(/\s+/g,' ').trim();
    if(location.length < 3){
        var locationlist = document.getElementById('location-list');
        locationlist.style.display = 'none';
        locationlist.innerHTML = '';
        return;
    }
    fetch('/getlocationsuggestions/?q='+location)
    .then(response => {
        response.json().then(response => {
            var locations = response.cities;
            // locations = locations.json();
            var locationlist = document.getElementById('location-list');
            locationlist.innerHTML = '';
            locationlist.style.display = 'flex';
            if(locations.length == 0){
                locationlist.style.display = 'none';

            }
            for (let location of locations) {
                locationlist.innerHTML += "<li class='location-item' onclick='setlocation(event)'>"+location+"</li>";
              
            }
        })
    })
}

function setlocation(event){
    var location = event.target.textContent;
    document.getElementById('location').value = location;
    document.getElementById('location-list').innerHTML = '';
    document.getElementById('location-list').style.display = 'none';
}


function findhobbies(event){
    const commonHobbies = [
        "Coding",
        "Programming",
        "Reading",
        "Writing",
        "Drawing",
        "Painting",
        "Photography",
        "Cooking",
        "Baking",
        "Gardening",
        "Hiking",
        "Camping",
        "Fishing",
        "Running",
        "Cycling",
        "Swimming",
        "Dancing",
        "Singing",
        "Playing a musical instrument",
        "Listening to music",
        "Watching movies",
        "Watching TV shows",
        "Playing video games",
        "Board games",
        "Card games",
        "Chess",
        "Puzzles",
        "Collecting stamps",
        "Collecting coins",
        "Collecting memorabilia",
        "Traveling",
        "Exploring new cultures",
        "Learning languages",
        "Yoga",
        "Meditation",
        "Volunteering",
        "Community service",
        "Exercising",
        "Weightlifting",
        "Boxing",
        "Martial arts",
        "Surfing",
        "Skateboarding",
        "Snowboarding",
        "Skiing",
        "Rock climbing",
        "Bouldering",
        "Parkour",
        "Scuba diving",
        "Skydiving",
        "Bungee jumping",
        "Paragliding",
        "Horseback riding",
        "Sailing",
        "Kayaking",
        "Canoeing",
        "Rafting",
        "Paintball",
        "Airsoft",
        "Archery",
        "Shooting",
        "Bowling",
        "Golf",
        "Tennis",
        "Badminton",
        "Table tennis",
        "Soccer",
        "Football",
        "Basketball",
        "Baseball",
        "Softball",
        "Volleyball",
        "Handball",
        "Rugby",
        "Cricket",
        "Gymnastics",
        "Figure skating",
        "Ice hockey",
        "Diving",
        "Snorkeling",
        "Birdwatching",
        "Stargazing",
        "Astrophotography",
        "Amateur astronomy",
        "Model building",
        "DIY projects",
        "Woodworking",
        "Metalworking",
        "Embroidery",
        "Knitting",
        "Crocheting",
        "Sewing",
        "Quilting",
        "Pottery",
        "Ceramics",
        "Calligraphy",
        "Origami",
        "Model painting",
        "Model trains",
        "Model airplanes",
        "Model cars",
        "Model ships",
        "Model rockets"
    ];
    const additionalHobbies = [
        "Astrology",
        "Tarot reading",
        "Palmistry",
        "Numerology",
        "Crystal healing",
        "Reiki",
        "Aromatherapy",
        "Herbalism",
        "Wine tasting",
        "Craft beer brewing",
        "Mixology",
        "Cocktail making",
        "Tea blending",
        "Coffee roasting",
        "Falconry",
        "Beekeeping",
        "Foraging",
        "Metal detecting",
        "Geocaching",
        "Orienteering",
        "Survivalism",
        "Bushcraft",
        "Metal music",
        "Jazz music",
        "Blues music",
        "Classical music",
        "Opera",
        "Electronic music production",
        "DJing",
        "Podcasting",
        "Blogging",
        "Vlogging",
        "Documentary filmmaking",
        "Animation",
        "Voice acting",
        "Stand-up comedy",
        "Improvisational theater",
        "Sketching",
        "Cartooning",
        "Digital art",
        "Calligraphy",
        "Typography",
        "Graphic design",
        "Web design",
        "User interface design",
        "User experience design",
        "Game design",
        "3D modeling",
        "Virtual reality",
        "Augmented reality",
        "Cosplay",
        "Costume design",
        "Stage makeup",
        "Special effects makeup",
        "Fashion design",
        "Sculpting",
        "Stone carving",
        "Wood carving",
        "Glassblowing",
        "Candle making",
        "Soap making",
        "Pottery",
        "Ceramics",
        "Jewelry making",
        "Silversmithing",
        "Goldsmithing",
        "Wire wrapping",
        "Macramé",
        "Leatherworking",
        "Shoemaking",
        "Blacksmithing",
        "Knife making",
        "Bonsai",
        "Terrarium gardening",
        "Aquascaping",
        "Miniature gardening",
        "Hydroponics",
        "Aquaponics",
        "Beekeeping",
        "Fermentation",
        "Cheese making",
        "Bread baking",
        "Pasta making",
        "Preserving",
        "Canning",
        "Pickling",
        "Fishing",
        "Surfing",
        "Kitesurfing",
        "Windsurfing",
        "Wakeboarding",
        "Skimboarding",
        "Kiteboarding",
        "Snowboarding",
        "Skiing",
        "Cross-country skiing",
        "Ice skating",
        "Ice fishing",
        "Dog sledding",
        "Snowmobiling",
        "Snowshoeing",
        "Ice climbing",
        "Sled dog racing",
        "Curling",
        "Lacrosse",
        "Field hockey",
        "Polo",
        "Squash",
        "Racquetball",
        "Handball",
        "Paddleboarding",
        "Rowing",
        "Canoeing",
        "Kayaking",
        "Whitewater rafting",
        "Surf kayaking",
        "Dragon boat racing",
        "Paddle tennis",
        "Fencing",
        "Taekwondo",
        "Karate",
        "Judo",
        "Aikido",
        "Kendo",
        "Brazilian Jiu-Jitsu",
        "Muay Thai",
        "Capoeira",
        "Parkour",
        "Rock climbing",
        "Indoor climbing",
        "Mountaineering",
        "Caving",
        "Abseiling",
        "Canyoneering",
        "Parasailing",
        "Paragliding",
        "Hang gliding",
        "Hot air ballooning",
        "Skydiving",
        "Bungee jumping",
        "BASE jumping",
        "Wingsuit flying",
        "Zip-lining",
        "Mountain biking",
        "Road cycling",
        "BMX",
        "Triathlon",
        "Obstacle course racing",
        "Parkour",
        "Agility training",
        "Frisbee",
        "Ultimate Frisbee",
        "Disc golf",
        "Kite flying",
        "Model rocketry",
        "Remote control cars",
        "Remote control planes",
        "Remote control boats",
        "Remote control helicopters",
        "Model trains",
        "Model airplanes",
        "Model cars",
        "Model ships",
        "Model rockets",
        "Model space vehicles",
        "Model robots",
        "Model animals",
        "Model buildings",
        "Model furniture",
        "Model trees",
        "Model people",
        "Model vehicles",
        "Model terrain",
        "Model dioramas",
        "Model railways",
        "Model landscaping",
        "Model bridges",
        "Model bridges",
        "Model towers",
        "Model structures",
        "Model landmarks",
        "Model landscapes",
        "Model mountains",
        "Model valleys",
        "Model waterfalls",
        "Model streams",
        "Model rivers",
        "Model lakes",
        "Model oceans",
        "Model seas",
        "Model volcanoes",
        "Model caves",
        "Model islands",
        "Model deserts",
        "Model forests",
        "Model jungles",
        "Model parks",
        "Model gardens",
        "Model farms",
        "Model cities",
        "Model towns",
        "Model villages",
        "Model castles",
        "Model forts",
        "Model palaces",
        "Model temples",
        "Model churches",
        "Model mosques",
        "Model synagogues",
        "Model monasteries",
        "Model cathedrals",
        "Model chapels",
        "Model shrines",
        "Model pyramids",
        "Model obelisks",
        "Model statues",
        "Model sculptures",
        "Model fountains",
        "Model aqueducts",
        "Model bridges",
        "Model viaducts",
        "Model roads",
        "Model highways",
        "Model streets",
        "Model avenues",
        "Model boulevards",
        "Model lanes",
        "Model alleys",
        "Model cul-de-sacs",
        "Model squares",
        "Model plazas",
        "Model circles",
        "Model ovals",
        "Model rectangles",
        "Model triangles",
        "Model pentagons",
        "Model hexagons",
        "Model octagons",
        "Model decagons",
        "Model dodecagons",
        "Model polygons",
        "Model polyhedra",
        "Model fractals",
        "Model tessellations",
        "Model mosaics",
        "Model patterns",
        "Model designs",
        "Model structures",
        "Model buildings",
        "Model landmarks",
        "Model monuments",
        "Model statues",
        "Model sculptures",
        "Model fountains",
        "Model parks",
        "Model gardens",
        "Model squares",
        "Model plazas",
        "Model circles",
        "Model rings",
        "Model loops",
        "Model paths",
        "Model trails",
        "Model roads",
        "Model highways",
        "Model streets",
        "Model avenues",
        "Model boulevards",
        "Model lanes",
        "Model alleys",
        "Model cul-de-sacs",
        "Model lanes",
        "Model courts",
        "Model drives",
        "Model ways",
        "Model paths",
        "Model trails",
        "Model walks",
        "Model trails",
        "Model paths",
        "Model sidewalks",
        "Model promenades",
        "Model boardwalks",
        "Model streets",
        "Model avenues",
        "Model boulevards",
        "Model lanes",
        "Model alleys",
        "Model cul-de-sacs",
        "Model squares",
        "Model plazas",
        "Model circles",
        "Model ovals",
        "Model rectangles",
        "Model triangles",
        "Model pentagons",
        "Model hexagons",
        "Model octagons",
        "Model decagons",
        "Model dodecagons",
        "Model polygons",
        "Model polyhedra",
        "Model fractals",
        "Model tessellations",
        "Model mosaics",
        "Model patterns",
        "Model designs",
        "Model structures",
        "Model buildings",
        "Model landmarks",
        "Model monuments",
        "Model statues",
        "Model sculptures",
        "Model fountains",
        "Model parks",
        "Model gardens",
        "Model squares",
        "Model plazas",
        "Model circles",
        "Model rings",
        "Model loops",
        "Model paths",
        "Model trails",
        "Model roads",
        "Model highways",
        "Model streets",
        "Model avenues",
        "Model boulevards",
        "Model lanes",
        "Model alleys",
        "Model cul-de-sacs",
        "Model lanes",
        "Model courts",
        "Model drives",
        "Model ways",
        "Model paths",
        "Model trails",
        "Model walks",
        "Model trails",
        "Model paths",
        "Model sidewalks",
        "Model promenades",
        "Model boardwalks"
    ];
    
    // Combine both arrays into one
    const allHobbies = [...commonHobbies, ...additionalHobbies];
    document.getElementById('hobbies-list').innerHTML = '';
    if(!event.data){
        document.getElementById('hobbies-list').innerHTML = '';
        document.getElementById('hobbies-list').style.display = 'none';
        return;
    }

    var hobbyItems = document.querySelectorAll('.hobby-item span');
    var hobbies = Array.from(hobbyItems).map(span => span.textContent);
    
    if(hobbies.length >= 3){
       
        document.getElementById('hobbies').setAttribute('disabled', 'true');
        document.getElementById('hobbies').value = 'You can only select up to 3 hobbies';
        return;
        
    }
    var hobby = event.target.value;
    // make hobbies lowercase
    hobbies= hobbies.map(hobby => hobby.toLowerCase());
    
    if(hobbies.includes(hobby.toLowerCase().replace(/,/g,'').trim())){
        event.target.value = event.target.value.replace(/,/g,'')
        return;
    }

    // add the hobby to the hobbies list if a comma is entered

    if(event.data === ','){
        event.preventDefault();
        if(hobby.length <2){
          event.target.value=  event.target.value.replace(/,/g, '');
            return;
        }     
        // remove coma from hobby
        hobby = hobby.slice(0, -1);

        console.log(hobby.length)
        var hobbyItem = document.createElement('div');
        hobbyItem.classList.add('hobby-item');
        
        hobbyItem.innerHTML = "<span>"+hobby+"</span><i class='uil uil-times' onclick='removehobby(event)'></i>";
        document.getElementsByClassName('hobbies-container')[0].innerHTML+= hobbyItem.outerHTML;
        document.getElementById('hobbies').value = '';
        document.getElementById('hobbies').removeAttribute('disabled');
        return;
    }


    document.getElementById('hobbies-list').innerHTML = '';
    document.getElementById('hobbies-list').style.display = 'none';
    allHobbies.forEach(hobby => {       
         
        if(hobby.toLowerCase().includes(event.target.value.toLowerCase())){

            if(document.getElementsByClassName('hobby-item').length > 4){

                return;
            }else{
                document.getElementById('hobbies-list').style.display = 'flex';
                var hobbyItem = document.createElement('li');
                hobbyItem.classList.add('hobby-item');
                hobbyItem.innerHTML = hobby;
                hobbyItem.onclick = function(){
                    var hobbyItem = document.createElement('div');
                    hobbyItem.classList.add('hobby-item');
                    
                    hobbyItem.innerHTML = "<span>"+hobby+"</span><i class='uil uil-times' onclick='removehobby(event)'></i>";
                    document.getElementsByClassName('hobbies-container')[0].innerHTML+= hobbyItem.outerHTML;
                    document.getElementById('hobbies').value = '';
                    document.getElementById('hobbies').removeAttribute('disabled');
                    document.getElementById('hobbies-list').innerHTML = '';
                }
    
                // add hobbies to the list with onclick event to add them to the hobbies list
                document.getElementById('hobbies-list').appendChild(hobbyItem);
            }


        }

    
    })

    // if(allHobbies.includes(hobby)){
    //     var hobbyItem = document.createElement('div');
    //     hobbyItem.classList.add('hobby-item');
    //     hobbyItem.innerHTML = "<span>"+hobby+"</span><i class='uil uil-times' onclick='removehobby(event)'></i>";
    //     document.getElementById('hobbies').insertAdjacentElement('beforebegin', hobbyItem);
    //     document.getElementById('hobbies').value = '';
        
    // }
   
}

function removehobby(event){
    hobby = event.currentTarget.parentNode
    document.getElementById('hobbies').removeAttribute('disabled');
    document.getElementById('hobbies').value = '';
    hobby.remove();
}