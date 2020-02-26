using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.IO;
using System.Resources;
using System.Text.RegularExpressions;
using System.Collections;

namespace crFTP
{
    /// <summary>
    /// FTP类
    /// </summary>
    /// <see cref="https://www.cnblogs.com/mrtester/p/11676168.html"/>
    /// <see cref="https://blog.csdn.net/crisschan"/>
    public class FTP
    {
        #region 变量声明
        // 服务器连接地址
        public string server;
        // 登陆帐号
        public string user;
        // 登陆口令
        public string pass;
        // 端口号
        public int port;
        // 无响应时间（FTP在指定时间内无响应）
        public int timeout;
        // 服务器错误状态信息
        public string errormessage;
        // 服务器状态返回信息
        private string messages;
        // 服务器的响应信息
        private string responseStr;
        // 链接模式（主动或被动，默认为被动）
        private bool passive_mode;
        // 上传或下载信息字节数
        private long bytes_total;
        // 上传或下载的文件大小
        private long file_size;
        // 主套接字
        private Socket main_sock;
        // 要链接的网络地址终结点
        private IPEndPoint main_ipEndPoint;
        // 侦听套接字
        private Socket listening_sock;
        // 数据套接字
        private Socket data_sock;
        // 要链接的网络数据地址终结点
        private IPEndPoint data_ipEndPoint;
        // 用于上传或下载的文件流对象
        private FileStream file;
        // 与FTP服务器交互的状态值
        private int response;
        // 读取并保存当前命令执行后从FTP服务器端返回的数据信息
        private string bucket;
        #endregion

        #region 构造函数
        public FTP()
        {
            server = null;
            user = null;
            pass = null;
            port = 21;
            passive_mode = true;
            main_sock = null;
            main_ipEndPoint = null;
            listening_sock = null;
            data_sock = null;
            data_ipEndPoint = null;
            file = null;
            bucket = "";
            bytes_total = 0;
            timeout = 10000; //无响应时间为10秒 
            messages = "";
            errormessage = "";
        }

        public FTP(string server, string user, string pass)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            port = 21;
            passive_mode = true;
            main_sock = null;
            main_ipEndPoint = null;
            listening_sock = null;
            data_sock = null;
            data_ipEndPoint = null;
            file = null;
            bucket = "";
            bytes_total = 0;
            timeout = 10000; //无响应时间为10秒
            messages = "";
            errormessage = "";
        }

        public FTP(string server, int port, string user, string pass)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            this.port = port;
            passive_mode = true;
            main_sock = null;
            main_ipEndPoint = null;
            listening_sock = null;
            data_sock = null;
            data_ipEndPoint = null;
            file = null;
            bucket = "";
            bytes_total = 0;
            timeout = 10000; //无响应时间为10秒 
            messages = "";
            errormessage = "";
        }

        public FTP(string server, int port, string user, string pass, int mode)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            this.port = port;
            passive_mode = mode <= 1 ? true : false;
            main_sock = null;
            main_ipEndPoint = null;
            listening_sock = null;
            data_sock = null;
            data_ipEndPoint = null;
            file = null;
            bucket = "";
            bytes_total = 0;
            this.timeout = 10000; //无响应时间为10秒
            messages = "";
            errormessage = "";
        }

        public FTP(string server, int port, string user, string pass, int mode, int timeout_sec)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            this.port = port;
            passive_mode = mode <= 1 ? true : false;
            main_sock = null;
            main_ipEndPoint = null;
            listening_sock = null;
            data_sock = null;
            data_ipEndPoint = null;
            file = null;
            bucket = "";
            bytes_total = 0;
            this.timeout = (timeout_sec <= 0) ? int.MaxValue : (timeout_sec * 1000); //无响应时间
            messages = "";
            errormessage = "";
        }
        #endregion

        #region 属性
        // 当前是否已连接
        public bool IsConnected
        {
            get
            {
                if (main_sock != null)
                    return main_sock.Connected;
                return false;
            }
        }

        // 当message缓冲区有数据则返回
        public bool MessagesAvailable
        {
            get
            {
                if (messages.Length > 0)
                    return true;
                return false;
            }
        }

        // 获取服务器状态返回信息, 并清空messages变量
        public string Messages
        {
            get
            {
                string tmp = messages;
                messages = "";
                return tmp;
            }
        }
        // 最新指令发出后服务器的响应
        public string ResponseString
        {
            get
            {
                return responseStr;
            }
        }
        // 在一次传输中,发送或接收的字节数
        public long BytesTotal
        {
            get
            {
                return bytes_total;
            }
        }
        // 被下载或上传的文件大小,当文件大小无效时为0
        public long FileSize
        {
            get
            {
                return file_size;
            }
        }

        // 链接模式: 
        // true 被动模式 [默认] 
        // false: 主动模式
        public bool PassiveMode
        {
            get
            {
                return passive_mode;
            }
            set
            {
                passive_mode = value;
            }
        }
        #endregion

        #region 操作
        // 操作失败
        private void Fail()
        {
            Disconnect();
            errormessage += responseStr;
            throw new Exception(responseStr);
        }

        // 下载文件类型
        // true:二进制文件 false:字符文件
        private void SetBinaryMode(bool mode)
        {
            if (mode)
                SendCommand("TYPE I");
            else
                SendCommand("TYPE A");
            ReadResponse();
            if (response != 200)
                Fail();
        }

        // 发送命令
        private void SendCommand(string command)
        {
            Byte[] cmd = Encoding.ASCII.GetBytes((command + "\r\n").ToCharArray());
            if (command.Length > 3 && command.Substring(0, 4) == "PASS")
            {
                messages = "\rPASS xxx";
            }
            else
            {
                messages = "\r" + command;
            }
            try
            {
                main_sock.Send(cmd, cmd.Length, 0);
            }
            catch (Exception ex)
            {
                try
                {
                    Disconnect();
                    errormessage += ex.Message;
                    return;
                }
                catch
                {
                    main_sock.Close();
                    file.Close();
                    main_sock = null;
                    main_ipEndPoint = null;
                    file = null;
                }
            }
        }

        private void FillBucket()
        {
            Byte[] bytes = new Byte[512];
            long bytesgot;
            int msecs_passed = 0;
            while (main_sock.Available < 1)
            {
                System.Threading.Thread.Sleep(50);
                msecs_passed += 50; // 当等待时间到,则断开链接
                if (msecs_passed > timeout)
                {
                    Disconnect();
                    errormessage += "Timed out waiting on server to respond.";
                    return;
                }
            }
            while (main_sock.Available > 0)
            {
                bytesgot = main_sock.Receive(bytes, 512, 0);
                bucket += Encoding.ASCII.GetString(bytes, 0, (int)bytesgot);
                System.Threading.Thread.Sleep(50);
            }
        }

        private string GetLineFromBucket()
        {
            int i;
            string buf = "";
            if ((i = bucket.IndexOf('\n')) < 0)
            {
                while (i < 0)
                {
                    FillBucket();
                    i = bucket.IndexOf('\n');
                }
            }
            buf = bucket.Substring(0, i);
            bucket = bucket.Substring(i + 1);
            return buf;
        }

        // 返回服务器端返回信息
        private void ReadResponse()
        {
            string buf;
            messages = "";
            while (true)
            {
                buf = GetLineFromBucket();
                if (Regex.Match(buf, "^[0-9]+ ").Success)
                {
                    responseStr = buf;
                    response = int.Parse(buf.Substring(0, 3));
                    break;
                }
                else
                    messages += Regex.Replace(buf, "^[0-9]+-", "") + "\n";
            }
        }

        // 打开数据套接字
        private void OpenDataSocket()
        {
            if (passive_mode)
            {
                string[] pasv;
                string server;
                int port;
                Connect();
                SendCommand("PASV");
                ReadResponse();

                if (response != 227)
                    Fail();
                try
                {
                    int i1, i2;
                    i1 = responseStr.IndexOf('(') + 1;
                    i2 = responseStr.IndexOf(')') - i1;
                    pasv = responseStr.Substring(i1, i2).Split(',');
                }
                catch (Exception)
                {
                    Disconnect();
                    errormessage += "Malformed PASV response: " + responseStr;
                    return;
                }
                if (pasv.Length < 6)
                {
                    Disconnect();
                    errormessage += "Malformed PASV response: " + responseStr;
                    return;
                }
                server = String.Format("{0}.{1}.{2}.{3}", pasv[0], pasv[1], pasv[2], pasv[3]);
                port = (int.Parse(pasv[4]) << 8) + int.Parse(pasv[5]);
                try
                {
                    CloseDataSocket();
                    data_sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

#if NET1
                    data_ipEndPoint = new IPEndPoint(Dns.GetHostByName(server).AddressList[0], port);
#else
                    data_ipEndPoint = new IPEndPoint(System.Net.Dns.GetHostEntry(server).AddressList[0], port);
#endif
                    data_sock.Connect(data_ipEndPoint);
                }
                catch (Exception ex)
                {
                    errormessage += "Failed to connect for data transfer: " + ex.Message;
                    return;
                }
            }
            else
            {
                Connect();
                try
                {
                    CloseDataSocket();
                    listening_sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    // 对于端口,则发送IP地址.下面则提取相应信息
                    string sLocAddr = main_sock.LocalEndPoint.ToString();
                    int ix = sLocAddr.IndexOf(':');
                    if (ix < 0)
                    {
                        errormessage += "Failed to parse the local address: " + sLocAddr;
                        return;
                    }
                    string sIPAddr = sLocAddr.Substring(0, ix);
                    // 系统自动绑定一个端口号(设置 port = 0)
                    System.Net.IPEndPoint localEP = new IPEndPoint(IPAddress.Parse(sIPAddr), 0);
                    listening_sock.Bind(localEP); sLocAddr = listening_sock.LocalEndPoint.ToString();
                    ix = sLocAddr.IndexOf(':');
                    if (ix < 0)
                    {
                        errormessage += "Failed to parse the local address: " + sLocAddr;
                    }
                    int nPort = int.Parse(sLocAddr.Substring(ix + 1));
                    // 开始侦听链接请求
                    listening_sock.Listen(1);
                    string sPortCmd = string.Format("PORT {0},{1},{2}", sIPAddr.Replace('.', ','), nPort / 256, nPort % 256);
                    SendCommand(sPortCmd);
                    ReadResponse();
                    if (response != 200)
                        Fail();
                }
                catch (Exception ex)
                {
                    errormessage += "Failed to connect for data transfer: " + ex.Message;
                    return;
                }
            }
        }

        private void ConnectDataSocket()
        {
            if (data_sock != null) // 已链接
                return;
            try
            {
                data_sock = listening_sock.Accept();
                // Accept is blocking
                listening_sock.Close();
                listening_sock = null;
                if (data_sock == null)
                {
                    throw new Exception("Winsock error: " + Convert.ToString(System.Runtime.InteropServices.Marshal.GetLastWin32Error()));
                }
            }
            catch (Exception ex)
            {
                errormessage += "Failed to connect for data transfer: " + ex.Message;
            }
        }

        private void CloseDataSocket()
        {
            if (data_sock != null)
            {
                if (data_sock.Connected)
                {
                    data_sock.Close();
                }
                data_sock = null;
            }
            data_ipEndPoint = null;
        }

        // 关闭所有链接
        public void Disconnect()
        {
            CloseDataSocket();
            if (main_sock != null)
            {
                if (main_sock.Connected)
                {
                    SendCommand("QUIT");
                    main_sock.Close();
                }
                main_sock = null;
            }
            if (file != null)
                file.Close();
            main_ipEndPoint = null;
            file = null;
        }
        // 链接到FTP服务器
        // 要链接的IP地址或主机名
        // 端口号
        // 登陆帐号
        // 登陆口令
        public void Connect(string server, int port, string user, string pass)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            this.port = port;
            Connect();
        }
        // 链接到FTP服务器
        // 要链接的IP地址或主机名
        // 登陆帐号
        // 登陆口令
        public void Connect(string server, string user, string pass)
        {
            this.server = server;
            this.user = user;
            this.pass = pass;
            Connect();
        }

        // 链接到FTP服务器
        public bool Connect()
        {
            if (server == null)
            {
                errormessage += "No server has been set.\r\n";
            }
            if (user == null)
            {
                errormessage += "No server has been set.\r\n";
            }
            if (main_sock != null)
                if (main_sock.Connected)
                    return true;
            try
            {
                main_sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
#if NET1
                main_ipEndPoint = new IPEndPoint(Dns.GetHostByName(server).AddressList[0], port);
#else
                main_ipEndPoint = new IPEndPoint(System.Net.Dns.GetHostEntry(server).AddressList[0], port);
#endif
                main_sock.Connect(main_ipEndPoint);
            }
            catch (Exception ex)
            {
                errormessage += ex.Message;
                return false;
            }
            ReadResponse();
            if (response != 220)
                Fail();
            SendCommand("USER " + user);
            ReadResponse();
            switch (response)
            {
                case 331:
                    if (pass == null)
                    {
                        Disconnect();
                        errormessage += "No password has been set.";
                        return false;
                    }
                    SendCommand("PASS " + pass);
                    ReadResponse();
                    if (response != 230)
                    {
                        Fail();
                        return false;
                    }
                    break;
                case 230:
                    break;
            }
            return true;
        }

        // 获取FTP当前(工作)目录下的文件列表
        // 返回文件列表数组
        public ArrayList List()
        {
            Byte[] bytes = new Byte[512];
            string file_list = "";
            long bytesgot = 0;
            int msecs_passed = 0;
            ArrayList list = new ArrayList();
            Connect();
            OpenDataSocket();
            SendCommand("LIST");
            ReadResponse();
            switch (response)
            {
                case 125:
                case 150:
                    break;
                default:
                    CloseDataSocket();
                    throw new Exception(responseStr);
            }
            ConnectDataSocket();
            while (data_sock.Available < 1)
            {
                System.Threading.Thread.Sleep(50);
                msecs_passed += 50;
                if (msecs_passed > (timeout / 10))
                {
                    break;
                }
            }
            while (data_sock.Available > 0)
            {
                bytesgot = data_sock.Receive(bytes, bytes.Length, 0);
                file_list += Encoding.ASCII.GetString(bytes, 0, (int)bytesgot);
                System.Threading.Thread.Sleep(50);
            }
            CloseDataSocket();
            ReadResponse();
            if (response != 226)
                throw new Exception(responseStr);
            foreach (string f in file_list.Split('\n'))
            {
                if (f.Length > 0 && !Regex.Match(f, "^total").Success)
                    list.Add(f.Substring(0, f.Length - 1));
            }
            return list;
        }

        // 获取到文件名列表
        // 返回文件名列表
        public ArrayList ListFiles()
        {
            ArrayList list = new ArrayList();
            foreach (string f in List())
            {
                if ((f.Length > 0))
                {
                    if ((f[0] != 'd') && (f.ToUpper().IndexOf("") < 0))
                        list.Add(f);
                }
            }
            return list;
        }
        // 获取路径列表
        // 返回路径列表
        public ArrayList ListDirectories()
        {
            ArrayList list = new ArrayList();
            foreach (string f in List())
            {
                if (f.Length > 0)
                {
                    if ((f[0] == 'd') || (f.ToUpper().IndexOf("") >= 0))
                        list.Add(f);
                }
            }
            return list;
        }

        // 获取原始数据信息.
        // 远程文件名
        // 返回原始数据信息. 
        public string GetFileDateRaw(string fileName)
        {
            Connect();
            SendCommand("MDTM " + fileName);
            ReadResponse();
            if (response != 213)
            {
                errormessage += responseStr;
                return "";
            }
            return (this.responseStr.Substring(4));
        }

        // 得到文件日期.
        // 远程文件名
        // 返回远程文件日期
        public DateTime GetFileDate(string fileName)
        {
            return ConvertFTPDateToDateTime(GetFileDateRaw(fileName));
        }

        private DateTime ConvertFTPDateToDateTime(string input)
        {
            if (input.Length < 14)
                throw new ArgumentException("Input Value for ConvertFTPDateToDateTime method was too short.");
            // YYYYMMDDhhmmss":
            int year = Convert.ToInt16(input.Substring(0, 4));
            int month = Convert.ToInt16(input.Substring(4, 2));
            int day = Convert.ToInt16(input.Substring(6, 2));
            int hour = Convert.ToInt16(input.Substring(8, 2));
            int min = Convert.ToInt16(input.Substring(10, 2));
            int sec = Convert.ToInt16(input.Substring(12, 2));
            return new DateTime(year, month, day, hour, min, sec);
        }

        // 获取FTP上的当前(工作)路径
        // 返回FTP上的当前(工作)路径
        public string GetWorkingDirectory()
        {
            // PWD - 显示工作路径
            Connect();
            SendCommand("PWD");
            ReadResponse();
            if (response != 257)
            {
                errormessage += responseStr;
            }
            string pwd;
            try
            {
                pwd = responseStr.Substring(responseStr.IndexOf("\"", 0) + 1); //5
                pwd = pwd.Substring(0, pwd.LastIndexOf("\""));
                pwd = pwd.Replace("\"\"", "\"");
                // 替换带引号的路径信息符号
            }
            catch (Exception ex)
            {
                errormessage += ex.Message;
                return null;
            }
            return pwd;
        }

        // 跳转服务器上的当前(工作)路径
        // 要跳转的路径 
        public bool ChangeDir(string path)
        {
            Connect();
            SendCommand("CWD " + path);
            ReadResponse();
            if (response != 250)
            {
                errormessage += responseStr;
                return false;
            }
            return true;
        }

        // 创建指定的目录
        // 要创建的目录
        public void MakeDir(string dir)
        {
            Connect();
            SendCommand("MKD " + dir);
            ReadResponse();
            switch (response)
            {
                case 257:
                case 250:
                    break;
                default:
                    {
                        errormessage += responseStr;
                        break;
                    }
            }
        }

        // 移除FTP上的指定目录
        // 要移除的目录
        public void RemoveDir(string dir)
        {
            Connect();
            SendCommand("RMD " + dir);
            ReadResponse();
            if (response != 250)
            {
                errormessage += responseStr;
                return;
            }
        }

        // 移除FTP上的指定文件
        // 要移除的文件名称
        public void RemoveFile(string filename)
        {
            Connect();
            SendCommand("DELE " + filename);
            ReadResponse();
            if (response != 250)
            {
                errormessage += responseStr;
            }
        }

        // 重命名FTP上的文件
        // 原文件名
        // 新文件名
        public void RenameFile(string oldfilename, string newfilename)
        {
            Connect();
            SendCommand("RNFR " + oldfilename);
            ReadResponse();
            if (response != 350)
            {
                errormessage += responseStr;
            }
            else
            {
                SendCommand("RNTO " + newfilename);
                ReadResponse();
                if (response != 250)
                {
                    errormessage += responseStr;
                }
            }
        }

        // 获得指定文件的大小(如果FTP支持)
        // 指定的文件
        // 返回指定文件的大小
        public long GetFileSize(string filename)
        {
            Connect();
            SendCommand("SIZE " + filename);
            ReadResponse();
            if (response != 213)
            {
                errormessage += responseStr;
            }
            return Int64.Parse(responseStr.Substring(4));
        }

        // 上传指定的文件
        // 要上传的文件
        public bool OpenUpload(string filename)
        {
            return OpenUpload(filename, filename, false);
        }

        // 上传指定的文件
        // 本地文件名
        // 远程要覆盖的文件名
        public bool OpenUpload(string filename, string remotefilename)
        {
            return OpenUpload(filename, remotefilename, false);
        }

        // 上传指定的文件
        // 本地文件名
        // 如果存在,则尝试恢复
        public bool OpenUpload(string filename, bool resume)
        {
            return OpenUpload(filename, filename, resume);
        }

        // 上传指定的文件
        // 本地文件名
        // 远程要覆盖的文件名 
        // 如果存在,则尝试恢复 
        public bool OpenUpload(string filename, string remote_filename, bool resume)
        {
            Connect();
            SetBinaryMode(true);
            OpenDataSocket();
            bytes_total = 0;
            try
            {
                file = new FileStream(filename, FileMode.Open);
            }
            catch (Exception ex)
            {
                file = null;
                errormessage += ex.Message;
                return false;
            }
            file_size = file.Length;
            if (resume)
            {
                long size = GetFileSize(remote_filename);
                SendCommand("REST " + size);
                ReadResponse();
                if (response == 350)
                    file.Seek(size, SeekOrigin.Begin);
            }
            SendCommand("STOR " + remote_filename);
            ReadResponse();
            switch (response)
            {
                case 125:
                case 150:
                    break;
                default:
                    file.Close();
                    file = null;
                    errormessage += responseStr;
                    return false;
            }
            ConnectDataSocket();
            return true;
        }

        // 下载指定文件
        // 远程文件名称
        public void OpenDownload(string filename)
        {
            OpenDownload(filename, filename, false);
        }

        // 下载并恢复指定文件
        // 远程文件名称
        // 如文件存在,则尝试恢复 
        public void OpenDownload(string filename, bool resume)
        {
            OpenDownload(filename, filename, resume);
        }

        // 下载指定文件
        // 远程文件名称
        // 本地文件名
        public void OpenDownload(string remote_filename, string localfilename)
        {
            OpenDownload(remote_filename, localfilename, false);
        }

        // 打开并下载文件
        // 远程文件名称
        // 本地文件名
        // 如果文件存在则恢复
        public void OpenDownload(string remote_filename, string local_filename, bool resume)
        {
            Connect();
            SetBinaryMode(true);
            bytes_total = 0;
            try
            {
                file_size = GetFileSize(remote_filename);
            }
            catch
            {
                file_size = 0;
            }
            if (resume && File.Exists(local_filename))
            {
                try
                {
                    file = new FileStream(local_filename, FileMode.Open);
                }
                catch (Exception ex)
                {
                    file = null;
                    throw new Exception(ex.Message);
                }
                SendCommand("REST " + file.Length);
                ReadResponse();
                if (response != 350)
                    throw new Exception(responseStr);
                file.Seek(file.Length, SeekOrigin.Begin);
                bytes_total = file.Length;
            }
            else
            {
                try
                {
                    file = new FileStream(local_filename, FileMode.Create);
                }
                catch (Exception ex)
                {
                    file = null;
                    throw new Exception(ex.Message);
                }
            }
            OpenDataSocket();
            SendCommand("RETR " + remote_filename);
            ReadResponse();
            switch (response)
            {
                case 125:
                case 150:
                    break;
                default:
                    file.Close();
                    file = null;
                    errormessage += responseStr;
                    return;
            }
            ConnectDataSocket();
            return;
        }

        // 上传文件(循环调用直到上传完毕)
        // 发送的字节数
        public long DoUpload()
        {
            Byte[] bytes = new Byte[512];
            long bytes_got;
            try
            {
                bytes_got = file.Read(bytes, 0, bytes.Length);
                bytes_total += bytes_got;
                data_sock.Send(bytes, (int)bytes_got, 0);
                if (bytes_got <= 0)
                {
                    // 上传完毕或有错误发生 
                    file.Close();
                    file = null;
                    CloseDataSocket();
                    ReadResponse();
                    switch (response)
                    {
                        case 226:
                        case 250:
                            break;
                        default: //当上传中断时 
                            {
                                errormessage += responseStr;
                                return -1;
                            }
                    }
                    SetBinaryMode(false);
                }
            }
            catch (Exception ex)
            {
                file.Close();
                file = null;
                CloseDataSocket();
                ReadResponse();
                SetBinaryMode(false);
                // throw ex; 
                // 当上传中断时 
                errormessage += ex.Message;
                return -1;
            }
            return bytes_got;
        }

        // 下载文件(循环调用直到下载完毕)
        // 接收到的字节点 
        public long DoDownload()
        {
            Byte[] bytes = new Byte[512];
            long bytes_got;
            try
            {
                bytes_got = data_sock.Receive(bytes, bytes.Length, 0);
                if (bytes_got <= 0)
                {
                    //下载完毕或有错误发生
                    CloseDataSocket();
                    file.Close();
                    file = null;
                    ReadResponse();
                    switch (response)
                    {
                        case 226:
                        case 250:
                            break;
                        default:
                            {
                                errormessage += responseStr;
                                return -1;
                            }
                    }
                    SetBinaryMode(false);
                    return bytes_got;
                }
                file.Write(bytes, 0, (int)bytes_got);
                bytes_total += bytes_got;
            }
            catch (Exception ex)
            {
                CloseDataSocket();
                file.Close();
                file = null;
                ReadResponse();
                SetBinaryMode(false);
                // throw ex;
                // 当下载中断时
                errormessage += ex.Message;
                return -1;
            }
            return bytes_got;
        }
        #endregion
    }
}

// 上述FTP类应用方法如下
// FTP ftp = new FTP("172.16.22.251", "hegaoji", "cstchgj");
// 建立文件夹
// ftp.MakeDir("test");
// ftp.ChangeDir("test");
// ftp.MakeDir("test1");
// ftp.ChangeDir("test1");
// ArrayList list = ftp.ListDirectories(); 
// ftp.RemoveDir("test\\test1");
//上传文件 
// ftp.Connect(); 
// ftp.OpenUpload(@"G:\dotNetFx40_Full_x86_x64.exe", Path.GetFileName(@"G:\dotNetFx40_Full_x86_x64.exe"));
// ftp.Disconnect(); 
// 如何上传文件夹可以通过先建立同名文件夹，遍历文件夹内的文件然后逐个update。递归可以搞定。