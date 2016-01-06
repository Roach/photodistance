require 'sinatra'
require 'mustache'

require 'flickraw'

FlickRaw.api_key="fd2eb338482cce716a9377425f01cef9"
FlickRaw.shared_secret="3d04e84455cb0806"

authenticated = false

token = flickr.get_request_token
auth_url = flickr.get_authorize_url(token['oauth_token'], :perms => 'delete')
# Print oauth url or open it in a browser window
# puts "Open this url in your process to complete the authication process : #{auth_url}"
system("open", auth_url)
puts "Copy here the number given when you complete the process."
verify = gets.strip

begin
  flickr.get_access_token(token['oauth_token'], token['oauth_token_secret'], verify)
  login = flickr.test.login
  puts "You are now authenticated as #{login.username} with token #{flickr.access_token} and secret #{flickr.access_secret}"
  $authenticated = true
rescue FlickRaw::FailedResponse => e
  puts "Authentication failed : #{e.msg}"
end

def authed
  $authenticated
end

def get_photos(user_location)
  # Get 5 photos, extract ID, URL and GEO, then format the JSON.
  photos = flickr.photos.search(:per_page => 50, :has_geo => true, :tags => ["landscape"])
  with_geo_data = photos.to_a.sample(5).map do |p|
    photo_info = flickr.photos.getInfo(:photo_id => p.id)
    photo_geo = photo_info.location
    {
      :id => p.id,
      :url => "https://farm#{p.farm}.staticflickr.com/#{p.server}/#{p.id}_#{p.secret}.jpg",
      :location_name => "#{photo_info.location.region._content}, #{photo_info.location.country._content}",
      :distance => get_distance(user_location, photo_geo)
    }
  end
  with_geo_data.sort! { |k| k[:distance] }
  { :closest => with_geo_data[0][:id], :photos => with_geo_data.shuffle.to_json }
end

def get_distance(user_location, photo_geo)
  photo_coords = [photo_geo.latitude, photo_geo.longitude].map{ |i| i.to_i}
  user_coords = user_location.split(',').map{ |i| i.to_i}
  distance(user_coords, photo_coords)
end

get '/' do
  GameUI.render
end

get '/getphotos.json' do
  get_photos(params[:location])
end

class GameUI < Mustache
  def authenticated
    authed
  end
end

# Taken from 
# http://stackoverflow.com/questions/12966638/how-to-calculate-the-distance-between-two-gps-coordinates-without-using-google-m
def distance loc1, loc2
  rad_per_deg = Math::PI/180  # PI / 180
  rkm = 6371                  # Earth radius in kilometers
  rm = rkm * 1000             # Radius in meters

  dlat_rad = (loc2[0]-loc1[0]) * rad_per_deg  # Delta, converted to rad
  dlon_rad = (loc2[1]-loc1[1]) * rad_per_deg

  lat1_rad, lon1_rad = loc1.map {|i| i * rad_per_deg }
  lat2_rad, lon2_rad = loc2.map {|i| i * rad_per_deg }

  a = Math.sin(dlat_rad/2)**2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon_rad/2)**2
  c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1-a))

  rm * c # Delta in meters
end
