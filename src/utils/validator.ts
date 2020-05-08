export const scrollToField = (fieldKey?: string) => {
  try {
    const labelNode = document.querySelector(
      `label[for="${fieldKey?.replace(/\./g, '-')}"]`,
    );
    if (labelNode) {
      labelNode.scrollIntoView({
        block: 'center',
      });
    } else {
      const inputNode = document.querySelector(
        `#${fieldKey?.replace(/\./g, '-')}`,
      );
      if (inputNode) {
        inputNode.scrollIntoView();
      }
    }
  } catch (err) {
    console.error(err);
  }
};
