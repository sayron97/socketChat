const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const messagesBlock = document.querySelector(".messages");

let userName = "";

const newUserConnected = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    socket.emit("new user", userName);
    addToUsersBox(userName);
};

const addToUsersBox = (userName) => {
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    }

    const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    inboxPeople.innerHTML += userBox;
};

function sendMessage() {
    let newMessage = document.getElementById('message_text').value
    socket.emit("new_message", newMessage)
}

function addNewMessage(messages) {
    console.log(messages);
    const userBox = `
    <div class="chat_ib ${messages.userId}-userlist">
      <h5>${messages.data}</h5>
    </div>
  `;
    messagesBlock.innerHTML += userBox;
}

// new user is created so we generate nickname and emit event
newUserConnected();

socket.on("new user", function (data) {
    data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function (userName) {
    document.querySelector(`.${userName}-userlist`).remove();
});

socket.on("new_message", function (data) {
    addNewMessage(data);
})