const readline = require('readline');
const User = require('./User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class ConsoleApp {
    static async main() {
        const users = [];

        while (true) {
            console.log("Welcome to the Blog Management System!");
            console.log("1. Create User");
            console.log("2. Login User");
            console.log("3. Delete User");
            console.log("4. Exit");
            const choice = await ConsoleApp.askQuestion("Choose an option: ");

            if (choice === '1') {
                await ConsoleApp.createUser(users);
            } else if (choice === '2') {
                await ConsoleApp.loginUser(users);
            } else if (choice === '3') {
                await ConsoleApp.deleteUser(users);
            } else if (choice === '4') {
                console.log("Exiting the application. Goodbye!");
                rl.close();
                return;
            } else {
                console.log("Invalid option. Please try again.");
            }
        }
    }

    static askQuestion(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }

    static async createUser(users) {
        const username = await ConsoleApp.askQuestion("Enter username: ");

        if (users.some(user => user.getName() === username)) {
            console.log("User already exists. Please choose a different username.");
            return;
        }

        const user = new User(username);
        users.push(user);
        console.log(`User '${username}' created successfully!`);

        console.log("You want to perform any operation? (yes/no)");
        console.log("1. Yes - Go to User Dashboard");
        console.log("2. No - Return to Main Menu");
        const operationChoice = await ConsoleApp.askQuestion("Choose an option: ");

        if (operationChoice === '1') {
            await ConsoleApp.userDashboard(user);
        }
    }

    static async loginUser(users) {
        if (users.length === 0) {
            console.log("No users available. Please create a user first.");
            return;
        }

        const loginUsername = await ConsoleApp.askQuestion("Enter username: ");
        const currentUser = users.find(user => user.getName() === loginUsername);

        if (!currentUser) {
            console.log("User not found.");
            return;
        }

        console.log(`Login successfully! Welcome Back, ${currentUser.getName()}`);
        await ConsoleApp.userDashboard(currentUser);
    }

    static async userDashboard(currentUser) {
        while (true) {
            console.log("User Dashboard - What operation do you want to perform?");
            console.log("1. Create Blog");
            console.log("2. Edit Blog");
            console.log("3. Delete Blog");
            console.log("4. View Blogs");
            console.log("5. Get Blogs Count");
            console.log("6. Log Out");
            const userChoice = await ConsoleApp.askQuestion("Choose an option: ");

            if (userChoice === '1') {
                await ConsoleApp.createBlog(currentUser);
            } else if (userChoice === '2') {
                await ConsoleApp.editBlog(currentUser);
            } else if (userChoice === '3') {
                await ConsoleApp.deleteBlog(currentUser);
            } else if (userChoice === '4') {
                ConsoleApp.viewAllBlogs(currentUser);
            } else if (userChoice === '5') {
                console.log(`Total blogs created by ${currentUser.getName()}: ${currentUser.getBlogsCount()}`);
            } else if (userChoice === '6') {
                console.log("Logging out...");
                return;
            } else {
                console.log("Invalid option. Please try again.");
            }
        }
    }

    static async createBlog(user) {
        const title = await ConsoleApp.askQuestion("Enter blog title: ");
        const content = await ConsoleApp.askQuestion("Enter blog content: ");

        const blogId = user.createBlog(title, content);
        if (blogId > 0) {
            console.log(`Blog created successfully with ID: ${blogId}`);
        } else {
            console.log("Failed to create blog.");
        }
    }

    static async editBlog(user) {
        if (user.getBlogsCount() === 0) {
            console.log("No blogs available to edit.");
            return;
        }

        ConsoleApp.viewAllBlogs(user);

        const editId = await ConsoleApp.askQuestion("Enter blog ID to edit: ");
        const blogToEdit = user.editBlog(parseInt(editId));

        if (blogToEdit) {
            console.log(`Current Title: ${blogToEdit.getTitle()}`);
            console.log(`Current Content: ${blogToEdit.getContent()}`);

            const newTitle = await ConsoleApp.askQuestion("Enter new title (or press Enter to keep current): ");
            const newContent = await ConsoleApp.askQuestion("Enter new content (or press Enter to keep current): ");

            let titleUpdated = true;
            let contentUpdated = true;

            if (newTitle.trim() !== '') {
                titleUpdated = blogToEdit.updateTitle(newTitle);
            }

            if (newContent.trim() !== '') {
                contentUpdated = blogToEdit.updateContent(newContent);
            }

            if (titleUpdated && contentUpdated) {
                console.log("Blog updated successfully!");
            } else {
                console.log("Failed to update blog.");
            }
        } else {
            console.log("Blog not found.");
        }
    }

    static async deleteBlog(user) {
        if (user.getBlogsCount() === 0) {
            console.log("No blogs available to delete.");
            return;
        }

        ConsoleApp.viewAllBlogs(user);

        const deleteId = await ConsoleApp.askQuestion("Enter blog ID to delete: ");
        if (user.deleteBlogById(parseInt(deleteId))) {
            console.log("Blog deleted successfully!");
        } else {
            console.log("Blog not found.");
        }
    }

    static viewAllBlogs(user) {
        const blogs = user.getAllBlogs();

        if (blogs.length === 0) {
            console.log(`No blogs found for user: ${user.getName()}`);
        } else {
            console.log(`All blogs created by ${user.getName()}:`);
            blogs.forEach(blog => {
                console.log(`ID: ${blog.getId()} Title: ${blog.getTitle()}`);
                console.log(`-------------------------------`);
            });
        }
    }

    static async deleteUser(users) {
        if (users.length === 0) {
            console.log("No users available to delete. Please create a user first.");
            return;
        }

        console.log("Available users:");
        users.forEach(user => console.log(`- ${user.getName()}`));

        const deleteUsername = await ConsoleApp.askQuestion("Enter username to delete: ");
        const userIndex = users.findIndex(user => user.getName() === deleteUsername);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            console.log("User deleted successfully.");
        } else {
            console.log("User not found.");
        }
    }
}

ConsoleApp.main();