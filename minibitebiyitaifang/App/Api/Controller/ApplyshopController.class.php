<?php
namespace Api\Controller;
use Think\Controller;
class ApplyshopController extends PublicController {

    public function applysubmit(){
        $join_log=M('join_log');
        if(IS_REQUEST){
            $data=I('request.');
            if(!$data['user']){
               echo json_encode(array('status'=>0,'message'=>'账号信息有误!','respondData'=>''));
               exit();
            }
            @$checkshopname=M("shangchang")->where("name='".$data['shopname']."'")->getField("id");
            if($checkshopname){
                echo json_encode(array('status'=>0,'message'=>'店铺名已经存在,请换词!','respondData'=>''));
               exit();
            }
            $arr['shopname']=$data['shopname'];
            $arr['cover']=$data['cover'];
            $arr['linkname']=$data['linkname'];
            $arr['tel']=$data['tel'];
            $arr['weixin']=$data['weixin'];
            $arr['digest']=$data['digest'];
            $arr['addtime']=time();
            $arr['uid']=$data['user'];
            if(!$arr['shopname'] || !$arr['cover'] || !$arr['linkname'] || !$arr['tel'] || !$arr['weixin'] || !$arr['digest']){
                echo json_encode(array('status'=>0,'message'=>'请将信息填完整!','respondData'=>''));
                exit();
            }
            $re=$join_log->add($arr);
            if($re){
                echo json_encode(array('status'=>1,'message'=>'请求成功!','respondData'=>'')); 
            }else{
                echo json_encode(array('status'=>0,'message'=>'请求失败!','respondData'=>'')); 
            }
            
        }
        exit();
    }
	/**
     * [applysubmit 入驻申请提交]
     * @return [type] [description]
     */
    public function applysubmitinfo(){
        $applyshopgg=M('Applyshop_gg');
        $web=M('web');
        $photo=$applyshopgg->where("id=1")->getField('photo');
        $respondData['guanggao']=__DATAURL__.$photo;
        $respondData['content']=$web->where("id=3")->getField("concent");
		echo json_encode(array('status'=>1,'message'=>'请求成功!','respondData'=>$respondData));
		exit();
    }

    public function caution_money_info(){
        $applyshopgg=M('Applyshop_gg');
        $web=M('web');
        $uid=I("request.uid");
        $photo=$applyshopgg->where("id=2")->getField('photo');
        $respondData['guanggao']=__DATAURL__.$photo;
        $respondData['content']=$web->where("id=4")->getField("concent");
        //查看是否已经交了保证金
        $shopmoney=M("user")->where("id=$uid")->getField("shop_money");
        $respondData['shopmoney']=$shopmoney ? $shopmoney : false;
        echo json_encode(array('status'=>1,'message'=>'请求成功!','respondData'=>$respondData));
        exit();
    }
    public function markorder(){
    
        $order=M("Applyshop_order");
        $uid = intval($_REQUEST['uid']);
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
            exit();
        }

        //下单
            try {   
                $data = array();
                $data['uid']=intval($uid);
                if (!$data['uid']) {
                    throw new \Exception("登陆账号信息有误 !");
                }
                $data['addtime']=time();
                $data['status']=10;//未付款
                $data['del']=0; 
                /*******解决屠涂同一订单重复支付问题 lisa**********/
                $data['order_sn']=$this->build_order_no();//生成唯一订单号
                $data['price']=I('request.price');
                

                /**************************************************/
                //dump($data);exit;
                $result = $order->add($data);
                if($result){
                    //把需要的数据返回
                    $arr['order_id'] = $result;
                    echo json_encode(array('status'=>1,'message'=>'请求成功!','respondData'=>$arr));
                }else{
                    throw new \Exception("下单 失败！");
                }
            } catch (Exception $e) {
                echo json_encode(array('status'=>0,'message'=>$e->getMessage(),'respondData'=>''));
                exit();
            }
            
            exit();
    }


    /**
     * 微信支付接口
     *  {"appid":"wx0411fa6a39d61297","noncestr":"3reA4pSqGBPPryEL","package":"Sign=WXPay","partnerid":"1230636401","prepayid":"wx20170406175858b261288c050041764688","timestamp":1491472738,"sign":"4A50B67D47E062A1F3B739D76C683D37"}
     *  appid
     *  noncestr
     *  package
     *  partnerid
     *  prepayid
     *  timestamp
     *  sign
     */
    public function dowxpay(){
        //引入文件
        header('Access-Control-Allow-Origin: *');
        header('Content-type: text/plain');
        vendor("wxpay.wxpay");
        //支付完成后的回调处理页面
        $notify_url = C("wxpay.applyshop_notify_url");
        //$notify_url = "https://gzleren.com/dushiw/index.php/Api/Applyshop/wxnotifyurl";

        $uid = I('request.uid');
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
            exit();
        }

        $order_id = I('request.order_id');//订单id

        $order = M('Applyshop_order')->where("id=".$order_id." AND del=0")->find();
        if (!$order) {
            echo json_encode(array('status'=>0,'err'=>'订单信息错误.'));
            exit();
        }

        $body = '缴纳保证金';

        // 获取支付金额       
        $total = $order['price']*100;     // 转成分
        // 商品名称
        $subject = '小程序:'.$body;
        // 订单号，示例代码使用时间值作为唯一的订单ID号
        $out_trade_no = $order['order_sn'];

        //获取用户openid
        //$tools = new \JsApiPay();
        $openId = M("user")->where("del=0 AND id=".$uid)->getField("openid");
        if(!$openId){
            echo json_encode(array('status'=>0,'err'=>'网络错误.'));
            exit();
        }

        //统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody($body);                        //商品名称
        $input->SetAttach("小程序"); 
        $input->SetOut_trade_no($out_trade_no);  //订单号
        $input->SetTotal_fee($total);                       //订单总金额
        $input->SetTime_start(date("YmdHis"));           //订单生成时间
        $input->SetTime_expire(date("YmdHis", time() + 600)); //订单失效时间
        $input->SetGoods_tag('');                       //设置商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠
        $input->SetNotify_url($notify_url);             //异步通知地址
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order_data = \WxPayApi::unifiedOrder($input); 

        // foreach($order_data as $key=>$value){
        //    echo "<font color='#00ff55;'>$key</font> : $value <br/>";
        // }
        //{"appid":"wx0411fa6a39d61297","noncestr":"3reA4pSqGBPPryEL","package":"Sign=WXPay","partnerid":"1230636401","prepayid":"wx20170406175858b261288c050041764688","timestamp":1491472738,"sign":"4A50B67D47E062A1F3B739D76C683D37"}   
        //{"appid":"wx05a63e391546d945","noncestr":"Uvxaj0yZeE5uw0Wd","package":"Sign=WXPay","partnerid":"1460680002","prepayid":"wx201704221807041af49e25c90779187614","timestamp":1492855550,"sign":"08FB66188544D438DF074F815EB585DF"}   
        $array=array(
            "appId"    =>$order_data['appid'],
            "timeStamp"=>(string)time(),
            "nonceStr" =>$order_data['nonce_str'],
            "package"  =>"prepay_id=".$order_data['prepay_id'],
            "signType" =>"MD5",
        );
        $str = 'appId='.$array['appId'].'&nonceStr='.$array['nonceStr'].'&package='.$array['package'].'&signType=MD5&timeStamp='.$array['timeStamp'];
        //重新生成签名
        $array['paySign']=strtoupper(md5($str.'&key='.\WxPayConfig::KEY));
    
        echo json_encode(array('status'=>1,'success'=>$array));
        //exit();

    }
    /**
     * [wxnotifyurl 微信支付异步通知]
     * @return [type] [description]
     */
    public function wxnotifyurl(){
        vendor("wxpay.wxpay");
        $xml = file_get_contents('php://input');
        $arr = json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
        //将支付的记录用txt的形式记录起来，文件夹自动创建，方便管理
        $dir='Data/Jsondata/paylog/'.date("Ym").'/'.date("d");
        if(!is_dir($dir)){
          mkdir($dir,0777,1);
        }
        $file=$dir."/cautionmoneylog.txt";
        $content="【".date("H:i:s",time())."】=>".$arr['out_trade_no']." >>".$arr['result_code']."<<\n".json_encode($arr)."\n";
        //将记录写进记录文件，有则追加，没有则新建文件。
        file_put_contents($file,$content,FILE_APPEND);
        
        //获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
        $out_trade_no   = $arr['out_trade_no'];      //商户订单号
        $trade_no       = $arr['transaction_id'];          //支付宝交易号
        $trade_status   = $arr['result_code'];      //交易状态
        $total_fee      = $arr['total_fee'];         //交易金额
        $notify_time    = strtotime($arr['time_end']); //通知的发送时间。格式为yyyy-MM-dd HH:mm:ss。
        $buyer_email    = $arr['buyer_email'];       //买家支付宝帐号；
        $parameter = array(
            "trade_no"      => $trade_no,     //支付宝交易号；
            "status"=>50,                     //50表示交易完成
        );
        if($arr['result_code'] == 'SUCCESS') {
            //更新订单状态
            $order=M('Applyshop_order');
            $re=$order->where('order_sn="'.trim($arr['out_trade_no']).'"')->save($parameter);
            if($re){
                //将用户的保证金额写进用户表
                $userid=$order->where('order_sn="'.trim($arr['out_trade_no']).'"')->getField("uid");
                M("user")->where("id=$userid")->setField("shop_money",$total_fee);
                //返回xml格式的通知回去
                $return = array('return_code'=>'SUCCESS','return_msg'=>'OK');
                $re_xml = '<xml>';
                foreach($return as $k=>$v){
                    $re_xml.='<'.$k.'><![CDATA['.$v.']]></'.$k.'>';
                }
                $re_xml.='</xml>';

                echo $re_xml;
            }else{
                echo "fail";
            }
        }else{
            echo "fail";
        }
    }
    /**
     * [checkrz 检测是否是认证用户]
     * @return [type] [description]
     */
    public function checkrz(){
        $user=M("user");
        $uid=I("request.uid");
        if(!$uid){
            echo json_encode(array('status'=>0,'message'=>'账号信息有误!','respondData'=>''));
            exit(); 
        }
        $info=$user->where("id=$uid")->getField("rztype");
        if($info){
            echo json_encode(array('status'=>1,'message'=>'请求成功','respondData'=>$info));
        }else{
            echo json_encode(array('status'=>0,'message'=>'请求失败','respondData'=>''));
        }
    }

}