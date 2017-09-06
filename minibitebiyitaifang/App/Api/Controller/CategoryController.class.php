<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class CategoryController extends PublicController {
	//***************************
	// 产品分类
	//***************************
    public function index(){
    	$list = M('category')->where('tid=1')->field('id,tid,name')->select();
        $catList = M('category')->where('tid='.intval($list[0]['id']))->field('id,name,bz_1')->select();
        foreach ($catList as $k => $v) {
            $catList[$k]['bz_1'] = __DATAURL__.$v['bz_1'];
        }

    	//json加密输出
		//dump($json);
		echo json_encode(array('status'=>1,'list'=>$list,'catList'=>$catList));
        exit();
    }

    //***************************
    // 产品分类
    //***************************
    public function getcat(){
        $catid = intval($_REQUEST['cat_id']);
        if (!$catid) {
            echo json_encode(array('status'=>0,'err'=>'没有找到产品数据.'));
            exit();
        }

        $catList = M('category')->where('tid='.intval($catid))->field('id,name,bz_1')->select();
        foreach ($catList as $k => $v) {
            $catList[$k]['bz_1'] = __DATAURL__.$v['bz_1'];
        }

        //json加密输出
        //dump($json);
        echo json_encode(array('status'=>1,'catList'=>$catList));
        exit();
    }
    public function brand(){
        $brand=M("brand");
        $page=I("request.page");
        if(!$page){
            $page=1;
        }
        $limit=($page*40)-40;

        $list=$brand->limit($limit,40)->select();
        if (!$list) {
            echo json_encode(array('status'=>0,'err'=>'没有更多的数据了.'));
            exit();
        }
        foreach ($list as $k => $v) {
            $list[$k]['digest']=mb_substr($v['digest'],0,39,"utf-8");
            $list[$k]['photo']=__DATAURL__.$v['photo'];
        }
        echo json_encode(array('status'=>1,'list'=>$list));
        exit();   
    }

}