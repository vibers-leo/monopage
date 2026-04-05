Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post 'signup', to: 'auth#signup'
      post 'login', to: 'auth#login'
      
      resource :profile, only: [:show, :update]
      get 'profiles/:username', to: 'profiles#public_show'
      resources :links, only: [:index, :create, :update, :destroy]
      resources :social_accounts, only: [:index, :create, :destroy] do
        get 'sync', on: :member
      end
    end
  end
end
