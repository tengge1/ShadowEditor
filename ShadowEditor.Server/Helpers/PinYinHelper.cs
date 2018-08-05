using Microsoft.International.Converters.PinYinConverter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ShadowEditor.Server.Helpers
{
    /// <summary>
    /// 拼音帮助类
    /// </summary>
    public class PinYinHelper
    {
        public static PingYinModel GetTotalPingYin(string str)
        {
            var chs = str.ToCharArray();
            //记录每个汉字的全拼
            Dictionary<int, List<string>> totalPingYins = new Dictionary<int, List<string>>();
            for (int i = 0; i < chs.Length; i++)
            {
                var pinyins = new List<string>();
                var ch = chs[i];
                //是否是有效的汉字
                if (ChineseChar.IsValidChar(ch))
                {
                    ChineseChar cc = new ChineseChar(ch);
                    pinyins = cc.Pinyins.Where(p => !string.IsNullOrWhiteSpace(p)).ToList();
                }
                else
                {
                    pinyins.Add(ch.ToString());
                }

                //去除声调，转小写
                pinyins = pinyins.ConvertAll(p => Regex.Replace(p, @"\d", "").ToLower());
                //去重
                pinyins = pinyins.Where(p => !string.IsNullOrWhiteSpace(p)).Distinct().ToList();
                if (pinyins.Any())
                {
                    totalPingYins[i] = pinyins;
                }
            }
            PingYinModel result = new PingYinModel();
            foreach (var pinyins in totalPingYins)
            {
                var items = pinyins.Value;
                if (result.TotalPingYin.Count <= 0)
                {
                    result.TotalPingYin = items;
                    result.FirstPingYin = items.ConvertAll(p => p.Substring(0, 1)).Distinct().ToList();
                }
                else
                {
                    //全拼循环匹配
                    var newTotalPingYins = new List<string>();
                    foreach (var totalPingYin in result.TotalPingYin)
                    {
                        newTotalPingYins.AddRange(items.Select(item => totalPingYin + item));
                    }
                    newTotalPingYins = newTotalPingYins.Distinct().ToList();
                    result.TotalPingYin = newTotalPingYins;

                    //首字母循环匹配
                    var newFirstPingYins = new List<string>();
                    foreach (var firstPingYin in result.FirstPingYin)
                    {
                        newFirstPingYins.AddRange(items.Select(item => firstPingYin + item.Substring(0, 1)));
                    }
                    newFirstPingYins = newFirstPingYins.Distinct().ToList();
                    result.FirstPingYin = newFirstPingYins;
                }
            }
            return result;
        }
    }

    public class PingYinModel
    {
        public PingYinModel()
        {
            TotalPingYin = new List<string>();
            FirstPingYin = new List<string>();
        }

        //全拼
        public List<string> TotalPingYin { get; set; }

        //首拼
        public List<string> FirstPingYin { get; set; }
    }
}
