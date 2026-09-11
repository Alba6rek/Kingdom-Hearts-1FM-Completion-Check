function SetStatus(
  message,
  state = ""
) {
  const element =
    document.getElementById(
      "save-status"
    );

  element.className =
    "status" +
    (
      state
        ? ` ${state}`
        : ""
    );

  element.textContent =
    message;
}

function DownloadJSON(
  object,
  fileName
) {
  const text =
    JSON.stringify(
      object,
      null,
      2
    );

  const blob =
    new Blob(
      [text],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    fileName;

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();

  URL.revokeObjectURL(
    url
  );
}

export {
  SetStatus,
  DownloadJSON
};
