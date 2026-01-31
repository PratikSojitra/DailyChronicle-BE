export const EmailTemplates = {
  // 1. Welcome Email
  welcome: (data: any) => ({
    subject: 'Welcome to Daily Chronicle!',
    html: `
      <h1>Welcome!</h1>
      <p>Thanks for joining us.</p>
      <a href="${data.frontendUrl}/unsubscribe?email=${data.email}">Unsubscribe</a>
    `,
  }),

  // 2. Curated Newsletter (The Builder)
  newsletter: (data: any) => {
    const postsHtml = data.posts.map((post) => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
        ${post.imageUrl ? `<img src="${post.imageUrl}" style="max-width: 100%;" />` : ''}
        <h3>${post.title}</h3>
        <p>${post.content.substring(0, 100)}...</p>
        <a href="${data.frontendUrl}/post/${post.slug}">Read More</a>
      </div>
    `).join('');

    return {
      subject: data.subject,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h1>${data.subject}</h1>
          <p>${data.description}</p>
          <hr/>
          ${postsHtml}
          <footer>
             <p>Sent to ${data.email}</p>
             <a href="${data.frontendUrl}/unsubscribe?email=${data.email}">Unsubscribe</a>
          </footer>
        </div>
      `,
    };
  },
};