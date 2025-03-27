<template>
  <div class="p-4 border-t border-solid border-t-gray-200 relative" ref="dropdownContainer">
    <button 
      class="flex gap-7 items-center w-full" 
      @click="toggleDropdown"
    >
      <div class="px-2 py-1.5 text-sm text-white bg-blue-600 rounded-lg">
        DY
      </div>
      <div class="flex flex-col gap-px flex-1 text-left">
        <div class="text-xs text-stone-500">Premium Account</div>
        <div class="text-sm text-stone-500">Last updated 2h ago</div>
      </div>
      <div
        v-html="
          `<svg width=&quot;20&quot; height=&quot;20&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;>
        <path d=&quot;M5.00781 7.5L10.00781 12.5L15.00781 7.5&quot; stroke=&quot;#666666&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;></path>
      </svg>`
        "
      ></div>
    </button>
    <transition name="dropdown">
      <div 
        v-if="isDropdownOpen" 
        class="absolute bottom-full mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
      >
        <ul class="py-2">
          <template v-for="(item, index) in menuItems" :key="index">
            <li 
                v-if="!item.divider" 
                class="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                @click="item.onClick ? item.onClick() : null"
              >
                <MaterialIcon 
                  :name="item.icon"
                  size="sm" 
                  color="text-stone-400" 
                  customClass="hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 cursor-pointer"
                />
                {{ item.label }}
              </li>
            <hr v-else class="my-2" />
          </template>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router'; // Add this import
import MaterialIcon from '@/components/Icons/MaterialIcon.vue';


export default {
  components: {
    MaterialIcon, // Register the component
  },
  setup() {
    const router = useRouter(); // Initialize router here
    const isDropdownOpen = ref(false);
    const dropdownContainer = ref(null);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const closeDropdown = (event) => {
      if (
        dropdownContainer.value &&
        !dropdownContainer.value.contains(event.target)
      ) {
        isDropdownOpen.value = false;
      }
    };

    const handleLogout = async () => {
      try {
        // Clear any stored user data
        localStorage.removeItem('user-email');
        localStorage.removeItem('user');
        
        // Close dropdown
        isDropdownOpen.value = false;
        
        // Navigate to login page
        await router.push({ name: 'login' });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const menuItems = ref([
      { icon: 'email', label: 'Deepesh@ha1ltd.com' },
      { icon: 'help_outline', label: 'Knowledge Base' },
      { icon: 'person', label: 'Personal Account' },
      { divider: true },
      { icon: 'work', label: 'Manage Workspace' },
      { icon: 'smart_toy', label: 'My LiSA' },
      { icon: 'tune', label: 'Customize LiSA' },
      { icon: 'settings', label: 'Settings' },
      { divider: true },
      { icon: 'logout', label: 'Log Out', onClick: handleLogout },
    ]);

    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    return {
      isDropdownOpen,
      toggleDropdown,
      dropdownContainer,
      menuItems,
      handleLogout,
    };
  },
};
</script>

<style>
.material-icons {
  font-size: 20px;
}

/* Dropdown animation */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
