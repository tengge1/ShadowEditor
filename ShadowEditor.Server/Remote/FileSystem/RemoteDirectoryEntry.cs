using System;
using System.IO;
using System.Linq;

using FubarDev.FtpServer.FileSystem;
using FubarDev.FtpServer.FileSystem.Generic;

namespace ShadowEditor.Server.Remote.FileSystem
{
    /// <summary>
    /// A <see cref="IUnixDirectoryEntry"/> implementation for the standard
    /// .NET file system functionality.
    /// </summary>
    public class RemoteDirectoryEntry : IUnixDirectoryEntry
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DotNetDirectoryEntry"/> class.
        /// </summary>
        /// <param name="fileSystem">The file system this entry belongs to</param>
        /// <param name="dirInfo">The <see cref="DirectoryInfo"/> to extract the information from</param>
        /// <param name="isRoot">Is this the root directory?</param>
        public RemoteDirectoryEntry(RemoteFileSystem fileSystem, DirectoryInfo dirInfo, bool isRoot)
        {
            FileSystem = fileSystem;
            Info = dirInfo;
            LastWriteTime = new DateTimeOffset(Info.LastWriteTime);
            CreatedTime = new DateTimeOffset(Info.CreationTimeUtc);
            var accessMode = new GenericAccessMode(true, true, true);
            Permissions = new GenericUnixPermissions(accessMode, accessMode, accessMode);
            IsRoot = isRoot;
        }

        /// <summary>
        /// Gets the underlying <see cref="DirectoryInfo"/>
        /// </summary>
        public DirectoryInfo Info { get; }

        /// <inheritdoc/>
        public bool IsRoot { get; }

        /// <inheritdoc/>
        public bool IsDeletable => !IsRoot && (FileSystem.SupportsNonEmptyDirectoryDelete || !Info.EnumerateFileSystemInfos().Any());

        /// <inheritdoc/>
        public string Name => Info.Name;

        /// <inheritdoc/>
        public IUnixPermissions Permissions { get; }

        /// <inheritdoc/>
        public DateTimeOffset? LastWriteTime { get; }

        /// <inheritdoc/>
        public DateTimeOffset? CreatedTime { get; }

        /// <inheritdoc/>
        public long NumberOfLinks => 1;

        /// <inheritdoc/>
        public IUnixFileSystem FileSystem { get; }

        /// <inheritdoc/>
        public string Owner => "owner";

        /// <inheritdoc/>
        public string Group => "group";
    }
}
