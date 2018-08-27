/**
 * 模型对象userData字段保存数据模板
 * @author tengge / https://github.com/tengge1
 */
function UserData() {
    this.ID = ''; // 模型ID，例如：5b7e38653fb63b0b50d332eb

    this.Name = ''; // 模型名称
    this.TotalPinYin = ''; // 模型名称全拼
    this.FirstPinYin = ''; // 模型名称拼音首字母

    this.Type = ''; // 模型类型
    this.Url = ''; // 模型文件url
    this.Thumbnail = ''; // 模型缩略图

    this.Server = true; // 是否从服务端加载

    this.Scripts = { // 模型绑定脚本
        Start: [], // 开始允许时仅执行一次
        Update: [], // 每帧都要执行
        Stop: [] // 结束运行时仅执行一次
    };

    this.CustomData = {}; // 自定义数据
}

export default UserData;