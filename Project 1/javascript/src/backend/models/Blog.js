class Blog {
  constructor(id, title, content, author) {
    this.id = id || 0;
    this.title = title || '';
    this.content = content || '';
    this.author = author || '';
    this.createdAt = new Date();
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  updateTitle(newTitle) {
    if (newTitle && newTitle.trim() !== '') {
      this.title = newTitle;
      return true;
    }
    return false;
  }

  getContent() {
    return this.content;
  }

  setContent(content) {
    this.content = content;
  }

  updateContent(newContent) {
    if (newContent && newContent.trim() !== '') {
      this.content = newContent;
      return true;
    }
    return false;
  }

  getAuthor() {
    return this.author;
  }

  setAuthor(author) {
    this.author = author;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt
    };
  }
}