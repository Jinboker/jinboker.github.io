let oEnemy = {
	maxTankAlive : 4,    //敌军坦克同一时间最多只能有四个
	maxNum : 20,         //敌军坦克的总数是20个
	num : 1,             //当前画出来的是第几个坦克，因为坦克是从正中间开始刷新，因此从1开始计数
	iBornDelay : 30,     //第一个NPC延迟30个循环后出生，以后的坦克延迟150个循环出生
	bMoveAble : true     //定时为假则NPC不会运动
};

let oEnemyData = [
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 4, 4],
	[8, 8, 4, 5, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 2, 0, 1, 0],
	[5, 4, 0, 2, 8, 0, 0, 2, 1, 0, 4, 4, 2, 0, 2, 0, 8, 0, 5, 0],
	[0, 0, 3, 0, 8, 2, 4, 4, 5, 0, 9, 0, 2, 8, 8, 2, 1, 0, 1, 0],
	[0, 5, 3, 0, 4, 2, 4, 8, 5, 0, 9, 0, 2, 8, 8, 2, 1, 8, 1, 0],
	[2, 2, 0, 0, 3, 3, 0, 0, 0, 1, 0, 8, 0, 8, 0, 0, 4, 4, 4, 0],
	[4, 0, 4, 4, 5, 1, 2, 0, 8, 8, 4, 4, 0, 0, 2, 9, 0, 2, 1, 0],
	[0, 8, 2, 1, 0, 8, 2, 8, 0, 0, 3, 8, 0, 8, 0, 8, 0, 9, 2, 1],
	[4, 4, 2, 8, 5, 4, 2, 5, 8, 2, 4, 8, 4, 2, 4, 8, 3, 8, 4, 4],
	[8, 8, 2, 8, 0, 8, 2, 8, 9, 8, 2, 9, 8, 3, 8, 8, 0, 8, 8, 2]
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/**
 * 敌方坦克对象，继承自TankObj
 */
class EnemyObj extends TankObj {
	constructor(i) {
		super();

		this.iIndex = i;
		this.iType;                      //敌军坦克的类型
		this.iChangeDirDelay = 10;       //坦克碰到障碍物后暂停10个循环后再改变方向
		this.bUiSet = true;              //UI界面右侧剩余坦克数的设置
		this.OrderNum;                   //本次绘制的是第几个坦克

		// 子弹相关
		this.oBullet = new BulletObj(i); //新建一个子弹对象
		aBullet.push(this.oBullet);      //将子弹对象添加到数组中
	}

	init(){
		this.bornInit();
		this.iDir = 2;
		this.x = (oEnemy.num % 3) * 192;
		this.y = 0;
		this.iType = oEnemyData[stage.num - 1][oEnemy.num - 1];
		this.iSpeed = (parseInt(this.iType/2) === 2) ? 2 : 1;
		this.OrderNum = oEnemy.num;
		oEnemy.num ++;
		oEnemy.iBornDelay += 150;

		this.moveSet();
	}

	draw(){
		// 判断坦克是否需要出生
		if (!this.bBorned) {
			// 剩余坦克数量的图标的减少
			cxt.bg.clearRect(481 - ((21 - this.OrderNum) % 2) * 18 , 20 + parseInt((22 - this.OrderNum) / 2) * 18, 16 , 16);
			this.born();
			return;
		}

		// 玩家在吃了定时后oEnemy.bMoveAble为假，NPC无法移动和发射子弹
		if (oEnemy.bMoveAble) {
			// 每次遇到障碍物后经过10个循环后改变方向
			(!this.bHitBarrier || !this.bHitTank) ? this.changeDir() : this.iChangeDirDelay = 10;

			//是否准备发射子弹
			this.shot();

			// 移动坦克
			this.move();
		}

		// 绘制坦克
		cxt.role.drawImage(oImg.enemyTank , 32 * this.iType ,  this.iDir * 64 + this.iWheelPic * 32 , 32 , 32 , this.x , this.y , 32 , 32);
	}

	changeDir(){
		this.iChangeDirDelay = delay(this.iChangeDirDelay , 10 , () => {
			this.iDir = parseInt(Math.random()*4);
			this.moveSet();
		});
	}

	shot(){
		if (!this.oBullet.bAlive) {
			this.iBulletDelay > 0 && this.iBulletDelay --;
			if (!this.iBulletDelay) {
				// 默认的延迟是20个循环，这里进行重置
				this.setBulletDelay();
				//这里的参数1表示这是NPC的坦克
				!this.oBullet.bAlive && this.oBullet.init(this.x , this.y , this.iDir , 1);
			}
		}
	}

	setBulletDelay(){
		let aDelay = [20 , 40 , 60];
		this.iBulletDelay = aDelay[parseInt(Math.random()*3)];
	}
}
