const openPopUp = (url, width, height, name) => {
  const { screen } = window;

  if (isNaN(width)) width = screen.width * 0.8;
  if (isNaN(height)) height = screen.height * 0.8;

  x = (screen.width - width) / 2;
  y = (screen.height - height) / 2;

  const features = `toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,resizable=no,status=no,width=${width},height=${height},left=${x},top=${y}`;

  const popupReference = window.open(url, name, features);
  try {
    if (window.focus()) {
      popupReference.focus();
    }
  } catch (e) {
    console.error(e);
  }
  return popupReference;
};
