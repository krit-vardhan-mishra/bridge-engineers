package project1;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ConsoleApp {
    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("Welcome to the Blog Management System!");
            System.out.println("1. Create User");
            System.out.println("2. Login User");
            System.out.println("3. Delete User");
            System.out.println("4. Exit");
            System.out.print("Choose an option: ");
            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {
                case 1:
                    createUser(users, sc);
                    break;
                case 2:
                    loginUser(users, sc);
                    break;

                case 3:
                    deleteUser(users, sc);
                    break;

                case 4:
                    System.out.println("Exiting the application. Goodbye!");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid option. Please try again.");
                    break;

            }
        }
    }

    private static void createUser(List<User> users, Scanner sc) {
        System.out.print("Enter username: ");
        String username = sc.nextLine();

        for (User user : users) {
            if (user.getName().equals(username)) {
                System.out.println("User already exists. Please choose a different username.");
                return;
            }
        }

        User user = new User(username);
        users.add(user);
        System.out.println("User '" + username + "' created successfully!");

        System.out.println("You want to perform any operation? (yes/no)");
        System.out.println("1. Yes - Go to User Dashboard");
        System.out.println("2. No - Return to Main Menu");
        System.out.print("Choose an option: ");
        int operationChoice = sc.nextInt();
        sc.nextLine();

        if (operationChoice == 1) {
            userDashboard(user, sc);
        }
    }

    private static void loginUser(List<User> users, Scanner sc) {
        if (users.isEmpty()) {
            System.out.println("No users available. Please create a user first.");
            return;
        }

        System.out.print("Enter username: ");
        String loginUsername = sc.nextLine();
        User currentUser = null;

        for (User user : users) {
            if (user.getName().equals(loginUsername)) {
                currentUser = user;
                break;
            }
        }

        if (currentUser == null) {
            System.out.println("User not found.");
            return;
        }

        System.out.println("Login successfully! Welcome Back, " + currentUser.getName());
        userDashboard(currentUser, sc);
    }

    private static void userDashboard(User currentUser, Scanner sc) {
        while (true) {
            System.out.println("User Dashboard - What operation do you want to perform?");
            System.out.println("1. Create Blog");
            System.out.println("2. Edit Blog");
            System.out.println("3. Delete Blog");
            System.out.println("4. View Blogs");
            System.out.println("5. Get Blogs Count");
            System.out.println("6. Log Out");
            System.out.print("Choose an option: ");

            int userChoice = sc.nextInt();
            sc.nextLine();

            switch (userChoice) {
                case 1:
                    createBlog(currentUser, sc);
                    break;

                case 2:
                    editBlog(currentUser, sc);
                    break;

                case 3:
                    deleteBlog(currentUser, sc);
                    break;

                case 4:
                    viewAllBlogs(currentUser);
                    break;

                case 5:
                    System.out.println(
                            "Total blogs created by " + currentUser.getName() + ": " + currentUser.getBlogsCount());
                    break;

                case 6:
                    System.out.println("Logging out...");
                    return;

                default:
                    System.out.println("Invalid option. Please try again.");
                    break;
            }
        }
    }

    private static void createBlog(User user, Scanner sc) {
        System.out.print("Enter blog title: ");
        String title = sc.nextLine();
        System.out.print("Enter blog content: ");
        String content = sc.nextLine();

        int blogId = user.createBlog(title, content);
        if (blogId > 0) {
            System.out.println("Blog created successfully with ID: " + blogId);
        } else {
            System.out.println("Failed to create blog.");
        }
    }

    private static void editBlog(User user, Scanner sc) {
        if (user.getBlogsCount() == 0) {
            System.out.println("No blogs available to edit.");
            return;
        }

        viewAllBlogs(user);

        System.out.print("Enter blog ID to edit: ");
        int editId = sc.nextInt();
        sc.nextLine();

        Blog blogToEdit = user.editBlog(editId);
        if (blogToEdit != null) {
            System.out.println("Current Title: " + blogToEdit.getTitle());
            System.out.println("Current Content: " + blogToEdit.getContent());

            System.out.print("Enter new title (or press Enter to keep current): ");
            String newTitle = sc.nextLine();
            System.out.print("Enter new content (or press Enter to keep current): ");
            String newContent = sc.nextLine();

            boolean titleUpdated = true;
            boolean contentUpdated = true;

            if (!newTitle.trim().isEmpty()) {
                titleUpdated = blogToEdit.updateTitle(newTitle);
            }

            if (!newContent.trim().isEmpty()) {
                contentUpdated = blogToEdit.updateContent(newContent);
            }

            if (titleUpdated && contentUpdated) {
                System.out.println("Blog updated successfully!");
            } else {
                System.out.println("Failed to update blog.");
            }
        } else {
            System.out.println("Blog not found.");
        }
    }

    private static void deleteBlog(User user, Scanner sc) {
        if (user.getBlogsCount() == 0) {
            System.out.println("No blogs available to delete.");
            return;
        }

        viewAllBlogs(user);

        System.out.print("Enter blog ID to delete: ");
        int deleteId = sc.nextInt();
        sc.nextLine();

        if (user.deleteBlogById(deleteId)) {
            System.out.println("Blog deleted successfully!");
        } else {
            System.out.println("Blog not found.");
        }
    }

    private static void viewAllBlogs(User user) {
        List<Blog> blogs = user.getAllBlogs();

        if (blogs.isEmpty()) {
            System.out.println("No blogs found for user: " + user.getName());
        } else {
            System.out.println("All blogs created by " + user.getName() + ":");
            for (Blog blog : blogs) {
                System.out.println("ID: " + blog.getId() + "Title: " + blog.getTitle());
            }
        }
    }

    private static void deleteUser(List<User> users, Scanner sc) {
        if (users.isEmpty()) {
            System.out.println("No users available to delete. Please create a user first.");
            return;
        }

        System.out.println("Available users:");
        for (User user : users) {
            System.out.println("- " + user.getName());
        }

        System.out.print("Enter username to delete: ");
        String deleteUsername = sc.nextLine();
        User userToDelete = null;

        for (User user : users) {
            if (user.getName().equals(deleteUsername)) {
                userToDelete = user;
                break;
            }
        }

        if (userToDelete != null) {
            users.remove(userToDelete);
            System.out.println("User deleted successfully.");
        } else {
            System.out.println("User not found.");
        }
    }

}
