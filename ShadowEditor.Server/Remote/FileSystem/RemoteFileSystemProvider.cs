using System.IO;
using System.Threading.Tasks;

using FubarDev.FtpServer.FileSystem;

namespace ShadowEditor.Server.Remote.FileSystem
{
    /// <summary>
    /// A <see cref="IFileSystemClassFactory"/> implementation that uses
    /// the standard .NET functionality to provide file system access.
    /// </summary>
    public class RemoteFileSystemProvider : IFileSystemClassFactory
    {
        private readonly string _rootPath;

        private readonly bool _useUserIdAsSubFolder;

        /// <summary>
        /// Initializes a new instance of the <see cref="DotNetFileSystemProvider"/> class.
        /// </summary>
        /// <param name="rootPath">The root path for all users</param>
        public RemoteFileSystemProvider(string rootPath)
            : this(rootPath, false)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DotNetFileSystemProvider"/> class.
        /// </summary>
        /// <param name="rootPath">The root path for all users</param>
        /// <param name="useUserIdAsSubFolder">Use the user id as subfolder?</param>
        public RemoteFileSystemProvider(string rootPath, bool useUserIdAsSubFolder)
        {
            _rootPath = rootPath;
            _useUserIdAsSubFolder = useUserIdAsSubFolder;
        }

        /// <summary>
        /// Gets or sets a value indicating whether deletion of non-empty directories is allowed.
        /// </summary>
        public bool AllowNonEmptyDirectoryDelete { get; set; }

        /// <inheritdoc/>
        public Task<IUnixFileSystem> Create(string userId, bool isAnonymous)
        {
            var path = _rootPath;
            if (_useUserIdAsSubFolder)
            {
                if (isAnonymous)
                    userId = "anonymous";
                path = Path.Combine(path, userId);
            }

            return Task.FromResult<IUnixFileSystem>(new RemoteFileSystem(path, AllowNonEmptyDirectoryDelete));
        }
    }
}
