import { communicateWithOpenAI } from "./../lib/openAIApi.js";
import data from "../data/dataset.js";
import { navigateTo } from "../router.js";

export const individual = (element) => {
  // console.log(element);
  // Filtrar datos basados en el elemento pasado como argumento
  const writer = data.find(item => item.id === element.id);
  //console.log(writer);

  const individualView = document.createElement('div');
  const individualChat = document.createElement("div");

  individualView.appendChild(individualChat);

  const genMess = document.createElement("div");
  genMess.className = "genMess";

  individualChat.innerHTML = `
    <div class="container-chat-ind">
      <div class="credentialWriter">
        <div class="writer-img">
          <img src="${writer.imageUrl}"/>
        </div>
        <div class="nameWriter"> 
          <h1 class="nameWriterc">${writer.name}</h1>
        </div>
        <div class="description-writer">
          <p>${writer.description}</p>
        </div>
      </div>

      <div class="chatI"></div>
    </div>

    <div class="container-Buttoms-chat">
      <button id="buttonchatGrupalI">Chat grupal</button>
      <button id="buttonBackHomeChatI">Regresar</button>
    </div>
  `;

  const chat = individualChat.querySelector(".chatI");
  chat.appendChild(genMess);

  const chatInput = document.createElement("div");
  chatInput.className = "chat-inputI";
  chatInput.innerHTML = `
    <textarea id="userInputI" placeholder="Escribe tu mensaje..."></textarea>
    <button id="SendButtomChatI">Enviar</button>
  `;
  chat.appendChild(chatInput);

  function messageUser() {
    const newMess = individualChat.querySelector("#userInputI");
    const newMessTxt = newMess.value;

    if (newMessTxt !== "") {
      const userNameContainer = document.createElement("div");
      userNameContainer.className = "userNameContainer";
      const userName = document.createElement("div");
      userName.className = "userNameI";
      userName.innerHTML = "Usuaria:";
      userNameContainer.appendChild(userName);
      genMess.appendChild(userName);

      const containernewMess = document.createElement("div");
      containernewMess.className = "messUserI";
      const viewMess = document.createElement("p");
      viewMess.className = "messageI";
      viewMess.innerHTML = newMessTxt;
      containernewMess.appendChild(viewMess);
      genMess.appendChild(containernewMess);
      newMess.value = "";

      //llamada a OpenAi
      communicateWithOpenAI(newMessTxt, writer)
        .then(response => {
          const nameSystem = document.createElement("div");
          nameSystem.className = "nameSystem";
          nameSystem.innerHTML = `${writer.name}:`;

          const systemMessage = document.createElement("div");
          systemMessage.className = "systemMessage";
          systemMessage.innerHTML = response.choices[0].message.content;
          genMess.appendChild(nameSystem);
          genMess.appendChild(systemMessage);
        })
      /* .catch(error => {
        console.error("error al comunicarse con la IA", error)
      }); */
    }
  }

  const SendButtomChat = chatInput.querySelector("#SendButtomChatI");
  SendButtomChat.addEventListener("click", () => {
    messageUser();
    //console.log("funciona");
  })

  const userInput = chatInput.querySelector("#userInputI");
  userInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      messageUser();
    }
  })

  const buttonBackHomeChat = individualChat.querySelector("#buttonBackHomeChatI");
  buttonBackHomeChat.addEventListener("click", () => {
    navigateTo("/");
  });

  const buttonchatGrupal = individualChat.querySelector("#buttonchatGrupalI");
  buttonchatGrupal.addEventListener("click", () => {
    navigateTo('/group');
  })

  return individualView;
}

