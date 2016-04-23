#include <stdlib.h>
#include <string>
#include <time.h>
#include <iostream>
using namespace std;

//基準時刻　太陽が春分点に存在する時刻(GMT)
const int BASE_YEAR = 2016;
const int BASE_MON  = 3;
const int BASE_DAY  = 20;
const int BASE_HOUR = 4;
const int BASE_MIN  = 30;
const int BASE_SEC  = 0;

//360度
const double ROUND_ANGLE = 360;

//年間日数と1日の時分秒
const int DAY_PER_YEAR = 365;
//const int DAY_PER_LEAPYEAR = 366;
const int HOUR_PER_DAY = 24;
const int MIN_PER_HOUR = 60;
const int SEC_PER_MIN  = 60;


//基準時刻における春分点の経度(東経)
const double BASE_LONGTITUDE = 112.5;

// １度ずれるのにかかる秒数
// angle / year (ay) = 360;
// day / year (dy) = 365; hour / day (hd) = 24; sec / hour (sh) = 3600;
// angle / sec = ay / (dy*hd*sh);
const double SEC_PER_ANGLE = DAY_PER_YEAR*HOUR_PER_DAY*MIN_PER_HOUR*SEC_PER_MIN/ROUND_ANGLE;

//指定時刻における春分点の経度を求める
double get_equix_longtitude(int year, int month, int day, int hour, int min);
//経度を0-360の範囲に合わせる
double fix_longtitude_between_round_angle(double longtitude);
time_t create_time_t(int year, int month, int day, int hour, int min);
int main(){
	get_equix_longtitude(2016, 4, 22, 10, 37);
	return 0;
}


double get_equix_longtitude(int year, int month, int day, int hour, int min){
	time_t base_time_t = create_time_t(BASE_YEAR, BASE_MON, BASE_DAY, BASE_HOUR, BASE_MIN);
	time_t compare_time_t = create_time_t(year, month, day, hour, min);

	//公転の影響による春分点の移動　西回り
	double dif_time = difftime(compare_time_t, base_time_t);
	double revolution_angle = dif_time / SEC_PER_ANGLE;

	cout << "sec / angle " << SEC_PER_ANGLE << endl;

	//自転の影響による春分点の移動　東回り
	double dif_daily_min = MIN_PER_HOUR*(BASE_HOUR - hour) + BASE_MIN - min;
	double rotation_angle = dif_daily_min / 4;

	//時刻における春分点
	double equix_longtitude = BASE_LONGTITUDE - revolution_angle + rotation_angle;

	//東経0-360に合わせる。　必要かはわからない。
	equix_longtitude = fix_longtitude_between_round_angle(equix_longtitude);

	cout << "equix longtitude: " << equix_longtitude << endl << endl;

	return equix_longtitude;
}

time_t create_time_t(int year, int month, int day, int hour, int min){
	struct tm *time = (tm*)malloc(sizeof(tm));
	time->tm_year    = year-1900;
	time->tm_mon     = month;
	time->tm_mday    = day;
	time->tm_hour    = hour;
	time->tm_min     = min;
	time->tm_sec     = 0;
	time->tm_isdst   = 0;
	time_t time_t = mktime(time);
	free(time);
	return time_t;
}

//東経0-360に合わせる。　必要かはわからない。
double fix_longtitude_between_round_angle(double longtitude){
	// 負の値は正に
	while(longtitude < 0){
		longtitude += ROUND_ANGLE;
	}
	//360度以上は下げる
	while(longtitude >= ROUND_ANGLE){
		longtitude -= ROUND_ANGLE;
	}
	return longtitude;
}

