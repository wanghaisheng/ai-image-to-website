// Sourced from: https://github.com/Nutlope/napkins/blob/f6c89c76b07b234c7ec690195df278db355f18fc/app/api/generateCode/route.ts#L102

export const descriptionPrompt = `Describe the attached screenshot in detail. I will send what you give me to a developer to recreate the original screenshot of a website that I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:

- Think step by step and describe the UI in great detail.
- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned
- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.
- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.
- Make sure to use the exact text from the screenshot.
`;
