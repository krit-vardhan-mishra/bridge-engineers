export const CreatePost = () => {

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-4">Create New Post</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="w-full p-2 bg-[#1C222A] border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Content</label>
          <textarea
            rows={4}
            className="w-full p-2 bg-[#1C222A] border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
            placeholder="Write your content here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
