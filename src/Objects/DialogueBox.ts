function DialogueBox() {
  const container = document.querySelector(".dialogue");
  let isRevealed = false;
  let messageIndex = 0;
  let messageQueue: string[] = [];
  /*
  On level change, DOM will persist it's previous state even though the function is rebuilt.
  therefore: on this functions re-run, clear & hide the dialogue
  */
  if (container) hideDisplay();

  function compressMsg(str: string) {
    let altering = str;
    const compressedStrings: string[] = [];
    while (altering.length >= 372) {
      compressedStrings.push(altering.slice(0, 371).trim() + "-");
      altering = "-" + altering.slice(371).trim();
    }
    if (altering.length) compressedStrings.push(altering.trim());
    return compressedStrings;
  }

  function buildMessage(messages: string[]) {
    messageQueue = messages.reduce((acc, msg) => {
      if (msg.length >= 372) {
        return [...acc, ...compressMsg(msg)];
      }
      return [...acc, msg];
    }, [] as string[]);

    if (container) {
      isRevealed = true;
      container.classList.add("revealed");
      container.classList.remove("hidden");
    }
  }
  function writeMessage() {
    if (container) {
      const currMessage = messageQueue[messageIndex];
      container.textContent = currMessage;
    }
  }
  function hideDisplay() {
    if (container) {
      container.classList.add("hidden");
      container.classList.remove("revealed");
      container.textContent = "";
      isRevealed = false;
      messageQueue = [];
      messageIndex = 0;
    }
  }
  function increment() {
    if (messageIndex === messageQueue.length - 1) {
      hideDisplay();
      return;
    }
    messageIndex += 1;
  }

  function isDialogueOpen() {
    return isRevealed;
  }
  return { buildMessage, writeMessage, increment, isDialogueOpen };
}
export default DialogueBox;
