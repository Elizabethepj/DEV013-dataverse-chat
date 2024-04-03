import { header } from "../components/header.js";
import { communicateWithOpenAI } from "../lib/openAIApi.js";
import data from "../data/dataset.js";
import {footer} from  "../components/footer.js";
import { navigateTo } from "../router.js";

export const group = () => {

  const groupView = document.createElement("div")
  groupView.className = "groupView"

  const headerElement = header();
  groupView.appendChild(headerElement);

  const containerChatG = document.createElement("div");
  containerChatG.className = "containerChatG";

  const credentialWriterG = document.createElement("div");
  credentialWriterG.className = "credentialWriterG";

  const titleContainer = document.createElement("div");
  titleContainer.className = "titleContainer";
  const chatTitle = document.createElement("h3");
  chatTitle.textContent = "Estás hablando con las escritoras...";
  titleContainer.appendChild(chatTitle);
  credentialWriterG.appendChild(titleContainer);
  containerChatG.appendChild(credentialWriterG);

  data.forEach(writer => {
    const imgChatGroupCont = document.createElement("div");
    imgChatGroupCont.className = "imgChatGroupCont";
    const imgChatGroup = document.createElement("img");
    imgChatGroup.className = "imgChatGroup";
    imgChatGroup.setAttribute("src", writer.imageUrl);
    imgChatGroup.setAttribute("alt", writer.name);

    const nameP = document.createElement("p");
    nameP.textContent = writer.name;

    credentialWriterG.appendChild(imgChatGroupCont);
    imgChatGroupCont.appendChild(imgChatGroup);
    imgChatGroupCont.appendChild(nameP);
  });

  const groupChatGlobal = document.createElement("div");
  groupChatGlobal.className = "groupChatGlobal";
  groupChatGlobal.innerHTML =
    `      
          <div class="chat-inputG">
            <textarea class= "texAreaChatG" placeholder="Escribe tu mensaje..."></textarea>
            <button class="SendButtomChat">Enviar</button>
          </div>            
            
        `;
    
  const groupChat = document.createElement("div");
  groupChat.className = "groupChat";
  groupChatGlobal.appendChild(groupChat);
  containerChatG.appendChild(credentialWriterG);
  containerChatG.appendChild(groupChatGlobal)
  groupView.appendChild(containerChatG);
  const chat = groupChatGlobal.querySelector(".chat-inputG");
  groupChatGlobal.appendChild(chat);

  async function messageUser() {
    const newMess = groupChatGlobal.querySelector(".texAreaChatG");
    const newMessTxt = newMess.value;
       

    if (newMessTxt !== "") {

      const userNameContainer = document.createElement("div");
      userNameContainer.className = "userNameContainer";

      const userName = document.createElement("div");
      userName.className = "userNameG";
      userName.innerHTML = "Usuaria:";
      groupChat.appendChild(userName);

      const containernewMess = document.createElement("div");
      containernewMess.className = "messUser";
      const viewMess = document.createElement("p");
      viewMess.className = "message";
      viewMess.innerHTML = newMessTxt;
      containernewMess.appendChild(viewMess);
      groupChat.appendChild(containernewMess);
      newMess.value = "";

      //llamada a openAi
      for (const writer of data) {
        try {
          const response = await communicateWithOpenAI(newMessTxt, writer);
          const nameSystem = document.createElement("div");
          nameSystem.className = "nameSystemG";
          nameSystem.innerHTML = `${writer.name}:`;

          const systemMessage = document.createElement("div");
          systemMessage.className = "systemMessageG";
          systemMessage.innerHTML = response.choices[0].message.content;
          groupChat.appendChild(nameSystem);
          groupChat.appendChild(systemMessage);
        } 
        catch (error) {
          //console.error("Error al comunicarse con la IA", error);
        }
      }
    }
  }

  const containerButtomsChat = document.createElement("div");
  containerButtomsChat.className = "container-Buttoms-chatG";
  containerButtomsChat.innerHTML = `
  <button id="buttonBackHomeChat">Regresar</button>
  `

  groupView.appendChild(containerButtomsChat);
 
  const SendButtomChat = groupChatGlobal.querySelector(".SendButtomChat");
  SendButtomChat.addEventListener("click", () => {
    //console.log("funciona")
    messageUser();
  })

  const userInput = groupChatGlobal.querySelector(".texAreaChatG");
  userInput.addEventListener("keydown", (event) => {
    //console.log("el input funciona")
    if (event.key === 'Enter') {
      messageUser();
    }
  })

  const buttonBackHomeChat = containerButtomsChat.querySelector("#buttonBackHomeChat");
  buttonBackHomeChat.addEventListener("click", () => {
    navigateTo("/");
  })

  const footerElement = footer();
  groupView.appendChild(footerElement);

  return groupView;
};