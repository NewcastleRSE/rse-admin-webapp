<template>
  <div class="min-h-full">
    <header class="relative bg-cyan-600 bg-blend-multiply bg-cover pb-32 sm:px-6 lg:px-8" :style="{ backgroundImage: `url('${BackgroundImage}')` }">
      <Disclosure as="nav" class="pb-8 bg-transparent" v-slot="{ open }">
      <div class="px-8 sm:px-8 lg:px-12">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-white font-bold">RSE Admin</h1>
            </div>
            <div class="hidden md:block">
              <div class="ml-6 flex items-baseline space-x-4">
                <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-cyan-700 text-white' : 'text-white hover:bg-cyan-500 hover:bg-opacity-75', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profile dropdown -->
              <Menu as="div" class="relative">
                <div>
                  <MenuButton class="flex max-w-xs items-center rounded-full text-sm text-white focus:outline-none">
                    <span class="sr-only">Open user menu</span>
                    <div class="flex flex-col pr-3 text-white">
                      <span class="font-bold text-right">{{user.displayName}}</span>
                      <span>{{user.jobTitle}}</span>
                    </div>
                    <img class="h-8 w-8 rounded-full" :src="`data:image/png;base64,${user.photo}`" :alt="user.displayName" />
                  </MenuButton>
                </div>
                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                      <a :href="item.href" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{ item.name }}</a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
              <button type="button" class="ml-3 rounded-full p-1 text-cyan-200 hover:text-white focus:outline-none">
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton class="inline-flex items-center justify-center rounded-md bg-cyan-600 p-2 text-cyan-200 hover:bg-cyan-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600">
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-cyan-700 text-white' : 'text-white hover:bg-cyan-500 hover:bg-opacity-75', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
        </div>
        <div class="border-t border-cyan-700 pb-3 pt-4">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt="" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-white">{{ user.name }}</div>
              <div class="text-sm font-medium text-cyan-300">{{ user.email }}</div>
            </div>
            <button type="button" class="ml-auto flex-shrink-0 rounded-full border-2 border-transparent bg-cyan-600 p-1 text-cyan-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-600">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href" class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-cyan-500 hover:bg-opacity-75">{{ item.name }}</DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
      <router-view class="mx-auto w-full" name="header" />
    </header>
    <main>
      <div class="py-6 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import BackgroundImage from '@/assets/img/header.jpeg'
import { useStore } from 'vuex'

const store = useStore()

const user = store.getters['auth/user']

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Finances', href: '#', current: false },
  { name: 'Forecasting', href: '#', current: false },
]
const userNavigation = [
  { name: 'Settings', href: '#' },
  { name: 'Sign Out', href: '#' },
]
</script>
