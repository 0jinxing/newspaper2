const openPopUp = (url, width, height, name) => {
  const { screen } = window;

  if (isNaN(width)) width = screen.width * 0.8;
  if (isNaN(height)) height = screen.height * 0.8;

  const x = (screen.width - width) / 2;
  const y = (screen.height - height) / 2 - 60; // 略微偏上，视觉中心

  const features = `toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,resizable=no,status=no,width=${width},height=${height},left=${x},top=${y}`;

  const popupReference = window.open(url, name, features);
  try {
    if (window.focus()) {
      popupReference.focus();
    }
  } catch (error) {
    console.error(error);
  }
  return popupReference;
};

export default openPopUp;
