package project1;

import java.util.ArrayList;
import java.util.List;

class User {
    private String name;
    private String age;
    private static int blogIdCounter = 0;
    private List<Blog> blogs = new ArrayList<>();

    public User(String name, String age) {
        this.name = name;
        this.age = age;
    }

    public User(String name) {
        this.name = name;
    }

    public int getBlogsCount() {
        return blogs.size();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public int createBlog(String title, String content) {
        Blog newBlog = new Blog(++blogIdCounter, title, content, this.name);
        blogs.add(newBlog);
        return newBlog.getId();
    }

    public Blog getBlogById(int id) {
        for (Blog blog : blogs) {
            if (blog.getId() == id) {
                return blog;
            }
        }
        return null;
    }

    public boolean deleteBlogById(int id) {
        for (int i = 0; i < blogs.size(); i++) {
            if (blogs.get(i).getId() == id) {
                blogs.remove(i);
                return true;
            }
        }
        return false;
    }

    public boolean canPostBlog() {
        return !blogs.isEmpty();
    }

    public List<Blog> getAllBlogs() {
        return blogs;
    }

    public Blog editBlog(int id) {
        for (Blog blog : blogs) {
            if (blog.getId() == id) {
                return blog;
            }
        }
        return null;
    }
}