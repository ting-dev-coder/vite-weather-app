import type { FC, ReactNode } from "react";
import { Button } from "../components/ui/button";
import { AlertTriangle, MapPin, RefreshCcw, RefreshCw } from "lucide-react";
import { useGeolocation } from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "../hooks/use-weather";
import CurrentWeather from "../components/current-weather";
import { HourlyTemperature } from "../components/hourly-temperature";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import { FavoriteCities } from "../components/favorite-cities";

interface IProps {
	children?: ReactNode;
}

const AlertSection = ({ title, description, actionBtn }: { title: string; description: string; actionBtn: ReactNode }) => {
	return (
		<Alert variant="destructive">
			<AlertTriangle className="h-4 w-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				<p>{description}</p>
				{actionBtn}
			</AlertDescription>
		</Alert>
	);
};

const WeatherDashboard: FC<IProps> = () => {
	const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation();

	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);
	const locationQuery = useReverseGeocodeQuery(coordinates);

	const handleRefresh = () => {
		getLocation();
		if (!coordinates) return;
		weatherQuery.refetch();
		forecastQuery.refetch();
		locationQuery.refetch();
	};

	if (locationLoading) {
		return <WeatherSkeleton />;
	}

	if (locationError) {
		return (
			<AlertSection
				title="Location Error"
				description={locationError}
				actionBtn={
					<Button className="w-fit" variant={"outline"} onClick={getLocation}>
						<MapPin className="mr-2 h-4 w-4" />
						Enable Location
					</Button>
				}
			/>
		);
	}

	if (!coordinates) {
		return (
			<AlertSection
				title="Location Required"
				description="Please enable location access to see your local weather."
				actionBtn={
					<Button variant="outline" onClick={getLocation} className="w-fit">
						<MapPin className="mr-2 h-4 w-4" />
						Enable Location
					</Button>
				}
			/>
		);
	}

	const locationName = locationQuery.data?.[0];

	if (weatherQuery.error || forecastQuery.error) {
		return (
			<AlertSection
				title="Error"
				description="Failed to fetch weather data. Please try again."
				actionBtn={
					<Button variant="outline" onClick={handleRefresh} className="w-fit">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				}
			/>
		);
	}

	if (!weatherQuery.data || !forecastQuery.data) {
		return <WeatherSkeleton />;
	}
	return (
		<div className="space-py-4">
			<FavoriteCities />

			<div className="flex items-center justify-between">
				<h1 className="text-xl font-bold tracking-tight">My Location</h1>
				<Button variant={"outline"} size={"icon"} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
					<RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching ? "animate-spin" : ""}`} />
				</Button>
			</div>
			{/* Current and Hourly weather */}
			<div className="grid gap-6">
				<div>
					<CurrentWeather data={weatherQuery.data} locationName={locationName} />
					<HourlyTemperature data={forecastQuery.data} />
				</div>

				<div className="grid gap-6 md:grid-cols-2 items-start">
					<WeatherDetails data={weatherQuery.data} />
					<WeatherForecast data={forecastQuery.data} />
				</div>
			</div>
		</div>
	);
};

export default WeatherDashboard;
