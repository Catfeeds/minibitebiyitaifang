/*
Navicat MySQL Data Transfer

Source Server         : leren
Source Server Version : 50547
Source Host           : localhost:3306
Source Database       : touyingyi

Target Server Type    : MYSQL
Target Server Version : 50547
File Encoding         : 65001

Date: 2017-06-14 15:07:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `lr_video`
-- ----------------------------
DROP TABLE IF EXISTS `lr_video`;
CREATE TABLE `lr_video` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '视频推荐表',
  `name` varchar(30) DEFAULT NULL COMMENT '名称',
  `digest` varchar(255) DEFAULT NULL COMMENT '视频介绍',
  `addtime` int(11) DEFAULT NULL COMMENT '添加时间',
  `del` tinyint(1) DEFAULT '0' COMMENT '删除状态，默认为0正常，1为删除',
  `pro_id` int(11) DEFAULT NULL COMMENT '对应的产品id值',
  `video` varchar(255) DEFAULT NULL COMMENT '视频的链接地址',
  `sort` int(8) DEFAULT '0' COMMENT '排序，从大到小',
  `visit` int(12) DEFAULT '0' COMMENT '浏览量',
  `renqi` int(12) DEFAULT '0' COMMENT '人气',
  `content` text COMMENT '详细内容',
  `type` tinyint(1) DEFAULT '0' COMMENT '视频链接，默认为0外链接，1为自行上传',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lr_video
-- ----------------------------
