from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from django.http import JsonResponse
from stream.camera import VideoCamera
from django.http import HttpResponse
from django.template import loader, Context

camera = VideoCamera()

def index(request):
	return render(request, 'streamapp/home.html')


def gen():
	global camera
	while True:
		frame = camera.get_frame()
		yield (b'--frame\r\n'
				b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def video_feed(request):
	return StreamingHttpResponse(gen(),
					content_type='multipart/x-mixed-replace; boundary=frame')

def features():
	global camera
	feature = camera.render_features()
	return feature

def feature_feed(request):
	return	JsonResponse(features())

