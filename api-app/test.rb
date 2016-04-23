require 'date'

#基準日と基準日の春分点
baseLongtitude = 112.5
baseDay = Time.gm(2016, 03, 20, 04, 30, 00)

#UTC における現在時刻
currentDay = Time.now.utc

#現在時刻と基準日の差の秒
difSec = currentDay - baseDay
#公転の影響による基準点との角度の差(東へ移動)
revolutionAngle = difSec / 87600

#現在時刻と基準日の差
difDailyMin = (currentDay.hour - baseDay.hour)*60 + currentDay.min - baseDay.min
#自転の影響による基準点との角度の差(西へ移動)
rotationAngle = difDailyMin / 4.0

#現在時刻における春分点の経度(緯度は0で固定)
equixLongtitude = baseLongtitude - revolutionAngle + rotationAngle

p equixLongtitude