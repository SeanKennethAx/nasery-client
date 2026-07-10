<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout :transition="{ name: 'card', mode: 'out-in' }">
			<NuxtPage :transition="{ name: 'card', mode: 'out-in' }" />
		</NuxtLayout>
	</div>
</template>

<style>
.card-enter-active,
.card-leave-active {
	transition: opacity 0.2s ease;
}

.card-enter-from,
.card-leave-to {
	opacity: 0;
}
</style>
