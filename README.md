### 国际化转换(目前仅支持简体转繁体)

#### 安装:
```
    npm install -g jingoal-i18n-cli
```

### 使用:
首先到项目的根目录下面执行:

```
    i18n init
```
执行完后会在根目录下面生成一个配置文件`.li8nrc`

`.li8nrc` 初始内容为:
```
{
    // 项目的语言的初始化文件
    entry: './myLi8n.js',
    // 生成后文件
    outFile: './myLi8n_tw.js'
}
```
执行:
```
    > li8n
```
就可以生成繁体文件

可以将繁简体转化功能集成到package.json中

在`script`添加:`i18n: "i18n"`

使用:`npm run i18n`