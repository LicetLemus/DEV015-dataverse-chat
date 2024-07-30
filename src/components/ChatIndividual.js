import { data } from "../data/dataset.js";
import { communicateWithOpenAI } from "../lib/openAIApi.js";

export const ChatIndividual = (props) => {
  const itemData = data.find((item) => item.id === props.id);
  const containerChat = document.createElement("div");
  containerChat.classList.add("chatIndividual");

  containerChat.innerHTML = `
        <div class="chat__container">
            <img class="chat__container__image" src="${itemData.extraInfo.logoUrl}" alt="chat icon" itemprop="image"/>
            <div class="chat_details">
              <h3 class="chat__details__name">${itemData.name}</h3>
              <h4 class="chat__details__status">En linea</h4>
            </div>
        </div>
        <div class="chat__message">
        </div>
        <div class="chat__input">
          <input 
            type="text" 
            placeholder="Escribe tu mensaje..."
            class="chat__input__field"/>
          <button class="chat__input__button">
            Enviar
          </button>
        </div>
    `;
  const chatInput = containerChat.querySelector(".chat__input__field");
  const chatButton = containerChat.querySelector(".chat__input__button");

  chatButton.addEventListener("click", async () => {
    // get the message from the input field
    const message = chatInput.value.trim();

    if (message) {
      try {
        // create the element for the user message
        const chatSend = document.createElement("div");
        chatSend.classList.add("chat__send");
        chatSend.innerHTML = `
          <div class="chat__message__text">
            ${message}
          </div>
          <img class="chat__message__image" src="../assets/icons/user.svg" alt="chat icon" itemprop="image"/>
        `;

        // add the user message to the element with the class chat__message
        containerChat.querySelector(".chat__message").appendChild(chatSend);
        // clear the input field
        chatInput.value = "";

        // communicate with OpenAI
        const response = await communicateWithOpenAI(props.id, message);

        // create the element for the response
        const chatReply = document.createElement("div");
        chatReply.classList.add("chat__reply");
        chatReply.innerHTML = `
          <img class="chat__message__image" src="${itemData.extraInfo.logoUrl}" alt="chat icon" itemprop="image"/>
          <div class="chat__reply__text">
            ${response}
          </div>
        `;
        // add the response to the element with the class chat__message
        containerChat.querySelector(".chat__message").appendChild(chatReply);

      } catch (error) {
        console.log("Error en la comunicación con OpenAI:", error);
      }
    }
  });

  return containerChat;
};