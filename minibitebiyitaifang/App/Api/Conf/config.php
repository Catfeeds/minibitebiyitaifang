<?php
//var_dump('11');exit;
header("Content-Type:text/html; charset=utf-8");
error_reporting(0);

// define('SELF_ROOT','http://www.lerenmobile.com/');
define('SELF_ROOT','/');

$urkn= SELF_ROOT."leren/Data/app/";
define('APP_URL',$urkn);
//$host='42.120.217.37';

return array(
	//'配置项'=>'配置值'
    //'DB_HOST'               => $host, // 服务器地址
    //'DB_NAME'               => 'aaa_pts_lscy'.$sckey,    // 数据库名
    //'DB_USER'               => '1234',      // 用户名
    //'DB_PWD'                => 'towebappptstowebapppts',       // 密码
    

    // 'DB_HOST'               =>  'rm-bp12j54a6nuw04l8t.mysql.rds.aliyuncs.com', // 服务器地址
    // 'DB_NAME'               =>  'r6hpk2l184',          // 数据库名
    // 'DB_USER'               =>  'r6hpk2l184',      // 用户名
    // 'DB_PWD'                =>  'leren888_win',//'1234QWERasdf',          // 密码
    'key'         =>   15222,//这个key是神奇的，网站源版代码解决支付问题的区分符
    'URL_MODEL'   =>0,

    'app_name'   =>'乐仁信息科技',

    'DB_FIELDS_CACHE'       =>true,
    //'base'					=>$urkn.ceil($sckey/50).'/'.$sckey.md5($sckey).'/' ,
	'base'					=>$urkn.'62/3057c1502ae5a4d514baec129f72948c266e/',
	'url'                     =>ceil($sckey/50).'/'.$sckey.md5($sckey),  
	'TMPL_CACHE_ON' => false,//禁止模板编译缓存
	'HTML_CACHE_ON' => false,//禁止静态缓存
	'LOG_RECORD'            =>  false,   // 默认不记录日志
	'LOG_TYPE'              =>  'File', // 日志记录类型 默认为文件方式
	'LOG_LEVEL'             =>  'EMERG,ALERT,CRIT,ERR',// 允许记录的日志级别
	'LOG_EXCEPTION_RECORD'  =>  false,
	LOAD_EXT_CONFIG => "functions",
	//更换模板变量规则，修改配置项
	'TMPL_PARSE_STRING'=>array(           //添加自己的模板变量规则
		'__DATA__'=>__ROOT__.'/Data'
	),
	'TMPL_ACTION_ERROR'     =>  'Public/error', // 默认错误跳转对应的模板文件
	'TMPL_ACTION_SUCCESS'   =>  'Public/success', // 默认成功跳转对应的模板文件

     //以上配置项，是从接口包中alipay.config.php 文件中复制过来，进行配置；
   
	'alipay'   =>array(
	 //这里是卖家的支付宝账号，也就是你申请接口时注册的支付宝账号
	//'seller_email'=>'18756901195@139.com',
    'seller_email'=>'',
	//这里是异步通知页面url，提交到项目的Pay控制器的notifyurl方法；
	'notify_url'=>$notify_url, 

	//这里是页面跳转通知url，提交到项目的Pay控制器的returnurl方法；
	'return_url'=>$return_url,

	//支付成功跳转到的页面，我这里跳转到项目的User控制器，myorder方法，并传参payed（已支付列表）
	//'successpage'=>'User/myorder?ordtype=payed', 
    'successpage'=>'index.php?m=Index&a=index&key='.$_GET['key'],	

	//支付失败跳转到的页面，我这里跳转到项目的User控制器，myorder方法，并传参unpay（未支付列表）
	//'errorpage'=>'User/myorder?ordtype=unpay', 
	'errorpage'=>'index.php?m=Index&a=index&key='.$_GET['key'],
    ),
);


?>