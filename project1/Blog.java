package project1;

public class Blog {
    private int id;
    private String title;
    private String content;
    private String author;

    public Blog(int id, String title, String content, String author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public Blog(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean updateTitle(String newTitle) {
        if (newTitle != null && !newTitle.isEmpty()) {
            this.title = newTitle;
            return true;
        }
        return false;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean updateContent(String newContent) {
        if (newContent != null && !newContent.isEmpty()) {
            this.content = newContent;
            return true;
        }
        return false;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Blog{" + "id=" + id + ", title='" + title + "', content='" + content + "', author='" + author + "'}";
    }

}
