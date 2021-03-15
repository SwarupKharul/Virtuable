from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from stream.camera import VideoCamera
from django.http import HttpResponse

def index(request):
	return render(request, 'streamapp/home.html')

def gen(camera):
	while True:
		frame = camera.get_frame()
		#feature = camera.render_features()
		#print(feature)
		yield (b'--frame\r\n'
				b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def video_feed(request):
	return StreamingHttpResponse(gen(VideoCamera()),
					content_type='multipart/x-mixed-replace; boundary=frame')