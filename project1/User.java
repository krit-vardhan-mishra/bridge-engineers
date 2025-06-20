package project1;

import java.util.ArrayList;
import java.util.List;

class User {
    private String name;
    private static int blogIdCounter = 0;
    private List<Blog> blogs = new ArrayList<>();

    public User(String name) {
        this.name = name;
    }

    public int getBlogsCount() {
        return blogs.size();
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

    public Blog editBlog(int id) {
        for (Blog blog : blogs) {
            if (blog.getId() == id) {
                return blog;
            }
        }
        return null;
    }

    public int createBlog(String title, String content) {
        Blog newBlog = new Blog(++blogIdCounter, title, content, this.name);
        blogs.add(newBlog);
        return newBlog.getId();
    }

    public void getBlogs() {
        for (Blog blog : blogs) {
            System.out.println(blog.toString());
        }
    }

    public boolean postBlog() {
        if (blogs.size() > 0) {
            return true;
        }
        return false;
    }
}