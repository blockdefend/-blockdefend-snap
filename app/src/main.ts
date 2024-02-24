/// Getting the app container.
const appContainer = document.getElementById("app");

/// Creating elements
const heading = document.createElement("h1");
heading.innerText = "BlockDefend Metamask Snap";

const button = document.createElement("button");
button.innerText = "Install";
button.onclick = async () => {
  await window.ethereum?.request({
    method: "wallet_requestSnaps",
    params: {
      "local:http://localhost:8080": {},
    },
  });
};

/// Inserting the elements
appContainer?.append(heading, button);
