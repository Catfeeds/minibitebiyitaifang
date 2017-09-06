<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class NewsController extends PublicController {
    //*****************************
    //  app端新闻分类
    //*****************************
    public function cat(){
        $json=M('category')->where('tid=20')->field('id,name')->order('sort desc,bz_2 desc')->select();
    	foreach ($json as $k => $v) {
            $json[$k]['name']=urlencode($v['name']);
        }
        //json加密输出
        //dump($json);
        echo urldecode(json_encode(array('catlist'=>$json)));
    }
    //*****************************
    //  app端新闻列表
    //  传递参数
    //  mui.openWindow({
    //     url:'info.html',
    //     id:'info.html',
    //     extras:{
    //         name:'mui',
    //         version:'0.5.8'
    //     }
    //  });http://www.mamicode.com/info-detail-1438417.html
    //*****************************
    public function lists(){
        $catid=intval($_POST['cat_id']);
        $keyword=$_POST['keyword'];
        $where = '1=1';
        if ($catid) {
           $where .= ' AND cid='.intval($catid);
           $cat_name = M('category')->where('id='.intval($catid))->getField('name');
        }else{
            $cat_name="";
        }

        if ($keyword) {
            $where .=' AND name LIKE "%'.$keyword.'%"';
        }

        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 0;
        }

        //获取总页数
        $count = M('news')->where($where)->count();
        $the_page = ceil($count/15);

        $newscat=M('news')->where($where)->field('id,name,photo,addtime,from')->order('addtime desc')->limit($page.',15')->select();
        /*echo json_encode(array('sql'=>M('news')->_sql()));
        exit();*/
        $json=array();
        foreach ($newscat as $k => $v) {
            $newscat[$k]['photo']="http://".$_SERVER['SERVER_NAME'].__DATA__.'/'.$v['photo'];
            $newscat[$k]['name']=urlencode($v['name']);
            $newscat[$k]['addtime']=date('Y-m-d',$v['addtime']);
        }
        //json加密输出
        //dump($json);
        echo urldecode(json_encode(array('newslist'=>$newscat,'cat_name'=>$cat_name,'the_page'=>$the_page)));
        exit();
    }
    //*****************************
    //  app端新闻详情
    //  var self = plus.webview.currentWebview();
    //  var name = self.name;
    //  var version = self.version;
    //*****************************
    public function detail(){
        $newid=intval($_REQUEST['news_id']);
        $detail=M('news')->where('id='.intval($newid))->find();
        if (!$detail) {
            echo json_encode(array('status'=>0,'err'=>'没有找到相关信息.'));
            exit();
        }

        $json=array();
        $json['status']=1;
        $json['id']=$detail['id'];
        $json['name']=urlencode($detail['name']);
        $json['addtime']=date('Y-m-d',$detail['addtime']);
        $json['renqi']=$detail['renqi'];
        $content = str_replace(C('content.dir'), __DATAURL__ , $detail['content']);
        $json['content']= html_entity_decode($content, ENT_QUOTES ,'utf-8');
        //json加密输出
        //dump($json);
        echo urldecode(json_encode($json));
    }
    //**************************
    //  app端新闻评论列表
    //***************************
    public function newsdp(){
        //print_r('expression');die();
        $id=intval($_REQUEST['news_id']);
        $dp=M('news_dp')->where('news_id='.intval($id))->select();
        $json=array();$json_arr=array();
        foreach ($dp as $k => $v) {
            $username= M('user')->where('id='.intval($v['uid']))->getField('name') ? M('user')->where('id='.intval($v['uid']))->getField('name') : M('user')->where('id='.intval($v['uid']))->getField('uname');
            $json['username']=urlencode($username);
            $json['addtime']=date('Y-m-d',$v['addtime']);
            $json['content']=$v['concent'];//数据库打成了concent字段
            $json_arr[] = $json;
        }
        //json加密输出
        //dump($json);
        echo urldecode(json_encode(array('status'=>1,'dp'=>$json_arr)));
        exit();
    }
    //*****************************
    //  app端新闻评论提交 session值
    //*****************************
    public function postdp(){
        $user_id = intval($_POST['user_id']);
        $news_id = intval($_POST['news_id']);
        $content = $_POST['content'];
        if (!$user_id) {
            echo json_encode(array('status'=>0,'err'=>'非法操作.'));
            exit();
        }
        $check_news = M('news')->where('id='.intval($news_id))->getField('id');
        if (!$check_news) {
            echo json_encode(array('status'=>0,'err'=>'该新闻已过了评论时间.'));
            exit();
        }

        if (!$content) {
            echo json_encode(array('status'=>0,'err'=>'请输入评论内容.'));
            exit();
        }

        //暂时还不知道session值，迟点再改
        $data = array();
        $data['uid'] = $user_id;
        $data['news_id'] = $news_id;
        $data['concent'] = $content;
        $data['addtime'] = time();
        $dp = M('news_dp')->add($data);
        if($dp){
            $username= M('user')->where('id='.intval($user_id))->getField('name') ? M('user')->where('id='.intval($user_id))->getField('name') : M('user')->where('id='.intval($user_id))->getField('uname');
            echo json_encode(array('status'=>1,'addtime'=>date('Y-m-d'),'username'=>$username));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'操作失败，请稍后再试.'));
            exit();
        }
    }
    
}