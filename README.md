# NG AI App - Image to Website

This is an AI App that's inspired by the [napkins](https://github.com/Nutlope/napkins) project to build a website from an image, it seemed like a cool idea and I wanted to give it a go with Cloudflare.

## How does this work?

First, we upload the image that was added to the form to CloudFlare's R2 storage, this is in order to retain the image for later use (I could send the data directly at a later step, however, I want to be able to use it again later).

Once done I make a request to the CloudFlare Workers AI service to the model `@cf/meta/llama-3.2-11b-vision-instruct`, using a prompt like this (sourced from [napkins](https://github.com/Nutlope/napkins)):

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Describe the attached screenshot in detail. I will send what you give me to a developer to recreate the original screenshot of a website that I sent you. Please listen very carefully. It's very important for my job that you follow these instructions:\n\n- Think step by step and describe the UI in great detail.\n- Make sure to describe where everything is in the UI so the developer can recreate it and if how elements are aligned\n- Pay close attention to background color, text color, font size, font family, padding, margin, border, etc. Match the colors and sizes exactly.\n- Make sure to mention every part of the screenshot including any headers, footers, sidebars, etc.\n- Make sure to use the exact text from the screenshot.\n"
    }
  ],
  "image": [
    ...
  ],
  "temperature": 0.2
}
```

CloudFlare responds with something like this:

```json
{
  "response": "The image shows a screenshot of a website, with a white background and black text. The top of the page features a navigation bar with various links to different sections of the site. \n\n*   **Navigation Bar**\n    *   The navigation bar is located at the top of the page and features a series of links to different sections of the site.\n    *   The links are arranged in a horizontal row.\n    *   Each link is represented by a small icon and text, and they are all displayed in a consistent font and color scheme.\n*   **Header**\n    *   Below the navigation bar, there is a header section that displays the logo and a search bar.\n    *   The logo is displayed prominently in the top-left corner of the page.\n    *   To the right of the logo, there is a search bar that allows users to search for specific content on the site.\n*   **Main Content**\n    *   Below the header, there is a main content area that displays a series of news articles and other content.\n    *   The articles are arranged in a grid layout, with each article featuring a headline, a brief summary, and an image.\n    *   The articles are displayed in a clean and simple design, with plenty of white space to make them easy to read.\n*   **Footer**\n    *   At the bottom of the page, there is a footer section that provides additional information and links to other parts of the site.\n    *   The footer includes a copyright notice, a link to the terms and conditions, and a link to the site's accessibility statement.\n    *   There is also a section that allows users to agree to cookies being used on the site.\n\nOverall, the website has a clean and simple design that makes it easy to navigate and find the information you're looking for. The use of a consistent font and color scheme throughout the site helps to create a cohesive look and feel, and the clear headings and concise summaries make it easy to quickly scan the content. The inclusion of a search bar and footer links provides additional functionality and helps users to find what they're looking for."
}
```

Which is basically just a description of what the model sees.

This is then used in a second call, but this time to the model "@cf/meta/llama-3.2-3b-instruct", and with a prompt like:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "<SYSTEM_PROMPT>"
    },
    {
      "role": "user",
      "content": "<PROMPT_FROM_BEFORE>"
    }
  ],
  "temperature": 0.2,
  "stream": true
}
```

Which will stream the HTML contents to be displayed. At the moment, CloudFlare doesn't any of the larger models available though and I have noticed that sometimes this response is not the complete HTML.

It will also error if you try to send too much information in the image.

This is really just to investigate the concept to see how it works though, head over to the [napkins](https://github.com/Nutlope/napkins) project for a more complete implementation.