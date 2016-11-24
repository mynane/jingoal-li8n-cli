#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var prompt = require('prompt');
var semver = require('semver');
var translate = require("./src/data").zh2Hant;
var Segment = require('segment');
var li8nrc = require('./src/li8nrc');
var segment = new Segment();
segment.useDefault();
var argv = require('minimist')(process.argv.slice(2));
var command = argv._;
var filePath = path.join(process.cwd()  +"/.li8nrc");
if(command[0] === 'init'){
    fs.writeFile(filePath, JSON.stringify(li8nrc), function (err) {
        if (err) throw err ;
        console.log("File Saved !"); //文件被保存
    });
    return;
}
var li8nJson = {};
fs.exists(filePath, function(exists){
    if(!exists){
        console.log("没找到国际化配置文件,请执行'li8n init'");
        return;
    }
    var file = fs.readFileSync(filePath, "utf8");
    li8nJson = JSON.parse(file);
    console.log(li8nJson);
    traditionlize(command[0] ? command[0] : li8nJson.entry);
});

function traditionlize(filePath) {
    var filePath = path.join(process.cwd() , filePath);
    fs.exists(filePath, function(exists){
        if(!exists){
            console.log("文件不存在");
            return;
        }
        var file = fs.readFileSync(filePath, "utf8");
        var reg1= new RegExp("[\\u4E00-\\u9FFF]+","ig");
        var newFile = file.replace(reg1, function(base){
            var result = segment.doSegment(base, {
                simple: true
            });
            var newStr = '';
            for(var i =0; i < result.length; i++){
                if(result[i].length===1){
                    newStr += translate[result[i]] ? translate[result[i]] : result[i];
                } else {
                    if(translate[result[i]]){
                         newStr += translate[result[i]];
                    } else {
                        var str = result[i];
                        for(var j = 0; j < str.length; j++){
                            newStr += translate[str[j]] ? translate[str[j]] : str[j];
                        }
                    }
                }
                
            }
             
            return newStr;
        });
        fs.exists(li8nJson.outfile, function(exists){
            if(exists) {
                createAfterConfirmation(li8nJson.outfile, newFile);
                return;
            }
            fs.writeFile(li8nJson.outfile, newFile, function (err) {
                if (err) throw err ;
                console.log('file clreate ' + chalk.blue(li8nJson.outfile)); //文件被保存
            });
        });
    });

    function createAfterConfirmation(name, newFile) {
        prompt.start();

        var property = {
            name: 'yesno',
            message: 'Directory "' + chalk.blue(name) + '" already exists. Continue?',
            validator: /y[es]*|n[o]?/,
            warning: 'Must respond yes or no',
            default: 'no'
        };

        prompt.get(property, function (err, result) {
            if (result.yesno[0] === 'y') {
                fs.writeFile(name, newFile, function (err) {
                    if (err) throw err ;
                    console.log('file clreate ' + chalk.blue(name)); //文件被保存
                });
            } else {
                console.log('Project initialization canceled');
                process.exit();
            }
        });
    }
}