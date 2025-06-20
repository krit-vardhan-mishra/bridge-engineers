package project1;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        Scanner sc = new Scanner(System.in);
        do {
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
                    System.out.print("Enter username: ");
                    String username = sc.nextLine();
                    users.add(new User(username));
                    System.out.println("User created successfully!");
                    System.out.println("You want to perform any operation? (yes/no)");
                    System.out.println("1. Yes");
                    System.out.println("2. No");
                    int operationChoice = sc.nextInt();
                    sc.nextLine();
                    
                    switch (operationChoice) {
                        case 1:
                            System.out.println("What operation do you want to perform?");
                            System.out.println("1. Create Blog");
                            System.out.println("2. Edit Blog");
                            System.out.println("3. Delete Blog");
                            System.out.println("4. View Blogs");
                            System.out.println("5. Get Blogs Count");
                            System.out.println("6. Log Out");
                            System.out.print("Choose an option: ");
                            int operation = sc.nextInt();   
                            sc.nextLine();

                            
                            break;
                    
                        default:
                            break;
                    }

                    break;

                case 2:
                    if (users.isEmpty()) {
                        System.out.println("No users available. Please create a user first.");
                        break;
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
                        break;
                    }

                    while (true) {
                        System.out.println("1. Create Blog");
                        System.out.println("2. Edit Blog");
                        System.out.println("3. Delete Blog");
                        System.out.println("4. View Blogs");
                        System.out.println("5. Logout");
                        System.out.print("Choose an option: ");
                        int userChoice = sc.nextInt();
                        sc.nextLine(); // Consume newline

                        switch (userChoice) {
                            case 1:
                                System.out.print("Enter blog title: ");
                                String title = sc.nextLine();
                                System.out.print("Enter blog content: ");
                                String content = sc.nextLine();
                                int blogId = currentUser.createBlog(title, content);
                                System.out.println("Blog created with ID: " + blogId);
                                break;

                            case 2:
                                if (currentUser.getBlogsCount() == 0) {
                                    System.out.println("No blogs available to edit.");
                                    break;
                                }
                                System.out.print("Enter blog ID to edit: ");
                                int editId = sc.nextInt();
                                sc.nextLine(); // Consume newline
                                Blog blogToEdit = currentUser.editBlog(editId);
                                if (blogToEdit != null) {
                                    System.out.print("Enter new title: ");
                                    String newTitle = sc.nextLine();
                                }
                            }
                        }
                    }
                                if (blogToEdit != null) {
                                    System.out.print("Enter new content: ");
                                    String newContent = sc.nextLine();
                                    if (blogToEdit.updateTitle(newTitle) && blogToEdit.updateContent(newContent)) {
                                        System.out.println("Blog updated successfully!");
                                    } else {
                                        System.out.println("Failed to update blog.");
                                    }
                                } else {
                                    System.out.println("Blog not found.");
                                }
                                break;

                            case 3:
                                if (currentUser.getBlogsCount() == 0) {
                                    System.out.println("No blogs available to delete.");
                                    break;
                                }
                                System.out.print("Enter blog ID to delete: ");
                                int deleteId = sc.nextInt();
                                sc.nextLine(); // Consume newline
                                if (currentUser.deleteBlogById(deleteId)) {
                                    System.out.println("Blog deleted successfully!");
                                } else {
                                    System.out.println("Blog not found.");
                                }
                                break;

                            case 4:
                                if (currentUser.getBlogsCount() == 0) {
                                    System.out.println("No blogs available.");
                                } else {
                                    for (Blog blog : currentUser.getBlogs()) {
                                        System.out.println("ID: " + blog.getId() + ", Title: " + blog.getTitle());
                                    }
                                }
                                break;

                            case 5:
                                System.out.println("Logging out...");
                                currentUser = null;
                                break;

                            default:
                                System.out.println("Invalid option. Please try again.");
                        }

                        if (currentUser == null) {
                            break; // Exit the user menu
                        }
                    }
        } while (true);
        sc.close();
    }
}
